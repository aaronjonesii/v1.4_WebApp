"""
Setup & Update Film Database

Created: 04.08.2021
Last Updated: 06.02.2021
Author: Anonymous One

Dependencies: mysql.connector
API Reference: https://popcorntime.api-docs.io/api/anime/FaCN5pS92RSykBRh4
API: https://popcorn-ru.tk/
"""

from requests import get
import mysql.connector
import socket
import time
import threading
from queue import Queue


def mysql_server_running(host, port):
    """
    Check if MySQL Server is running on port specified
    :return: boolean
    """
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    while sock.connect_ex((host, port)) != 0:
        return False
    sock.close()
    return True


def get_film_routes(api_url, film_type):
    """
    Get available film routes from API
    :param film_type: movies or shows
    :return: List of routes for from the API
    """
    allowed_film_types = ['movies', 'shows']
    if film_type not in allowed_film_types:
        raise ValueError(
            f"FilmTypeError in getFilm: '{film_type}' is not in the allowed film types => {allowed_film_types}")
    url = api_url + film_type
    print(f"\nPreparing to get {film_type}, this may take a minute or two...")
    data = get(url)
    if data.status_code == 200:
        film_routes = data.json()
        return film_routes
    elif data.status_code == 503:
        if 'Retry-After' in data.headers:
            raise ValueError(
                f"{data.status_code} {data.reason} @ {url}\nRetry in {data.headers['Retry-After']} minutes.")
        raise ValueError(f"{data.status_code} {data.reason} @ {url}")
    else:
        raise ValueError(f"{data.status_code} {data.reason} @ {url}")


def check_film_route(host, user, passwd, database, api_url, film_type, film_route, all_films):
    if mysql_server_running(host='localhost', port=3306):
        film_database = FilmDatabase(host, user, passwd, database, api_url, film_type)
        cursor = film_database.cursor()
        film_database.use_database(cursor)
        film_route_data = get(api_url + film_route)
        if film_route_data.status_code == 200:
            if len(film_route_data.json()) != 0:
                for film in film_route_data.json():
                    all_films.append(film)
                    film_database.add_film(cursor, film)
        else:
            raise ConnectionError(f"Something went wrong with {film_route}")
    else:
        print(f'\n[!] MySQL Server is not running [!]')


def check_film_routes(host, user, passwd, database_name, api_url, film_type, routes):
    lock = threading.Lock()
    threads = 50
    all_films = []

    def threader():
        while True:
            film_route = q.get()
            check_film_route(host, user, passwd, database_name, api_url, film_type, film_route, all_films)
            q.task_done()

    q = Queue()
    for n in range(threads):
        t = threading.Thread(target=threader)
        t.daemon = True
        t.start()
    # Insert route into queue
    for film_route in routes:
        q.put(film_route)
    # Block until all tasks are finished
    q.join()
    print(f"Total {film_type}: {len(all_films)}")


class FilmDatabase:
    """Movies Database to establish MySQLConnection"""
    def __init__(self, host, user, passwd, database_name, api_url, film_type):
        """Specify what database to connect to"""
        self.host = host
        self.user = user
        self.passwd = passwd
        try:
            self.database = self.connect()
            self.database_name = database_name
            self.table_name = f"films_{film_type.rstrip(film_type[-1])}"
            self.film_type = film_type
            self.api_url = api_url
            allowed_film_types = ['movies', 'shows']
            if self.film_type not in allowed_film_types:
                raise ValueError(f"FilmTypeError in FilmDatabase#init: '{film_type}' is not in the allowed film types => {allowed_film_types}")
        except mysql.connector.errors.ProgrammingError:
            raise ValueError(f'\n [!] Authentication denied for {user}@{host} [!]')

    def connect(self):
        """
        Sets up a connection with MYSQL server and instantiates a MySQLCursor object
        :return: MySQLCursor<object>
        """
        return mysql.connector.connect(
            host=self.host,
            user=self.user,
            passwd=self.passwd,
        )

    def cursor(self):
        """
        Returns MySQLCursor object of MySQLConnection object
        :return: MySQLCursor<object>
        """
        return self.database.cursor()

    def exists(self, cursor):
        """
        Check if database specified exists
        :return: boolean
        """
        sql = f"SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '{self.database_name}';"
        cursor.execute(sql)
        results = cursor.fetchall()
        if len(results) > 0: return True
        else: return False

    def create_database(self, cursor):
        """
        Create database
        :return: None
        """
        cursor.execute(f"CREATE DATABASE {self.database_name};")

    def use_database(self, cursor):
        """Use Database"""
        cursor.execute(f"USE {self.database_name};")

    def table_exists(self, cursor):
        """
        Check if specified table exists
        :return: boolean
        """
        sql = f"SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '{self.table_name}'"
        cursor.execute(sql)
        results = cursor.fetchall()
        if len(results) > 0: return True
        else: return False

    def create_film_table(self, cursor):
        """
        Creates table for films base on film type
        :return: None
        """
        try:
            if self.film_type == 'movies':
                movie_sql = f"""CREATE TABLE {self.table_name} (
                                    _id VARCHAR(20),
                                    imdb_id VARCHAR(10),
                                    title VARCHAR(255),
                                    year VARCHAR(4),
                                    synopsis TEXT,
                                    runtime VARCHAR(4),
                                    released INT,
                                    certification VARCHAR(255),
                                    torrents TEXT,
                                    trailer VARCHAR(255),
                                    genres VARCHAR(255),
                                    images TEXT,
                                    rating VARCHAR(255),
                                    PRIMARY KEY(_id)
                                    )"""
                cursor.execute(movie_sql)
            if self.film_type == 'shows':
                show_sql = f"""CREATE TABLE {self.table_name} (
                                                    _id VARCHAR(20),
                                                    imdb_id VARCHAR(10),
                                                    tvdb_id VARCHAR(10),
                                                    title VARCHAR(255),
                                                    year VARCHAR(4),
                                                    slug VARCHAR(150),
                                                    num_seasons TINYINT,
                                                    images TEXT,
                                                    rating VARCHAR(255),
                                                    PRIMARY KEY(_id)
                                                    )"""
                cursor.execute(show_sql)
        except mysql.connector.errors.ProgrammingError as e:
            raise ValueError(f'TableCreationError in FilmDatabase#createFilmTable: \n{e} [!]')

    def show_table_cols(self, cursor):
        """Show table columns"""
        cursor.execute(f"SHOW COLUMNS FROM {self.table_name};")
        results = cursor.fetchall()
        print(f'Database Table {self.table_name}: ')
        for col in results:
            print(col)

    def show_film_count(self, cursor):
        """
        Returns number of films in database
        :return: number
        """
        cursor.execute(f"SELECT COUNT(*) FROM {self.database_name}.{self.table_name};")
        results = cursor.fetchall()
        database_film_count = 0
        for (i,) in results:
            database_film_count = i
        return database_film_count

    def add_film(self, cursor, json_film):
        """
        Add films to database
        :param cursor: MySQLCursor object
        :param json_film: JSON film of show, or movie
        :return: None
        """
        try:
            value_placeholders = ', '.join(['%s'] * len(json_film))
            cols = ', '.join(json_film.keys())
            film_sql = f" INSERT IGNORE INTO {self.table_name} ( {cols} ) VALUES ( {value_placeholders} ); "
            values = tuple(str(val) for val in json_film.values())
            cursor.execute(film_sql, values)
            self.database.commit()
        except mysql.connector.errors.ProgrammingError as e:
            raise ValueError(f"AddFilmError in FilmDatabase#addFilm: film below:\n{json_film}\nError: {e}")

    def update_database(self, cursor):
        """
        Updates Database with films
        :param cursor: MySQLCursor
        :returns: Nada
        """
        film_routes = get_film_routes(self.api_url, self.film_type)
        check_film_routes(self.host, self.user, self.passwd, self.database_name, self.api_url, self.film_type, film_routes)


def setup_db(host, user, passwd, database, api_url, film_type):
    if mysql_server_running(host='localhost', port=3306):
        film_database = FilmDatabase(host, user, passwd, database, api_url, film_type)
        cursor = film_database.cursor()
        if not film_database.exists(cursor):
            film_database.create_database(cursor)
        film_database.use_database(cursor)
        if not film_database.table_exists(cursor):
            film_database.create_film_table(cursor)
        # film_database.show_table_cols(cursor)
        film_database.update_database(cursor)
        return film_database.show_film_count(cursor)
    else:
        print(f'\n[!] MySQL Server is not running [!]')


if __name__ == '__main__':
    # Start Stopwatch
    time_start = time.perf_counter()

    host = 'localhost'
    user = 'anonymous'
    passwd = 'anonymous'
    database = 'backend'
    api_url = 'https://popcorn-ru.tk/'

    # film_type = 'shows'
    film_type = 'movies'

    film_count = setup_db(host, user, passwd, database, api_url, film_type)
    # film_routes = get_film_routes(api_url, film_type)
    # check_film_routes(host, user, passwd, database, api_url, film_type, film_routes)
    # print(film_routes)

    # Stop Stopwatch
    time_end = time.perf_counter()
    cal_time = time_end - time_start
    if cal_time > 60:
        cal_time = cal_time / 60
        print(f"Finsihed in {cal_time}mins")
    else:
        print(f"Finsihed in {cal_time}secs")
