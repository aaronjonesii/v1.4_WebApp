"""
Setup & Update Film Database

Created: 04.08.2021
Last Updated: 04.09.2021
Author: Anonymous One

Dependencies: mysql.connector
API Reference: https://popcorntime.api-docs.io/api/anime/FaCN5pS92RSykBRh4
"""

from requests import get
import mysql.connector
import socket
import json
import sys


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


def get_films(film_type):
    """
    Get movies from internet and format for database
    :param film_type: anime, movie, or show
    :return: List of JSON movies
    """
    allowed_film_types = ['anime', 'movie', 'show']
    if film_type not in allowed_film_types:
        sys.exit(f"FilmTypeError in getFilm: '{film_type}' is not in the allowed film types => {allowed_film_types}")
    url = "https://tv-v2.api-fetch.sh/exports/" + film_type
    print(f"\nPreparing to get {film_type}s, this may take a minute or two...")
    data = get(url)
    if data.status_code == 200:
        film_list = []
        for bytes_line in data.iter_lines():
            string_line = bytes_line.decode()
            json_film = json.loads(string_line)
            is__v_present = False
            for key, val in zip(json_film.keys(), json_film.values()):
                if key == '__v':
                    is__v_present = True
                elif type(val) is dict:
                    json_film[key] = json.dumps(json_film[key])
                else:
                    pass
            if is__v_present: json_film['_v'] = json_film.pop(f'__v')
            film_list.append(json_film)
        return film_list
    else: sys.exit(f"{data.status_code} {data.reason} @ {url}")


class FilmDatabase:
    """Movies Database to establish MySQLConnection"""
    def __init__(self, host, user, passwd, database_name, film_type):
        """Specify what database to connect to"""
        self.host = host
        self.user = user
        self.passwd = passwd
        try:
            self.database = self.connect()
            self.database_name = database_name
            self.table_name = f"{film_type}s"
            self.film_type = film_type
            allowed_film_types = ['anime', 'movie', 'show']
            if self.film_type not in allowed_film_types:
                sys.exit(f"FilmTypeError in FilmDatabase#init: '{film_type}' is not in the allowed film types => {allowed_film_types}")
        except mysql.connector.errors.ProgrammingError:
            sys.exit(f'\n [!] Authentication denied for {user}@{host} [!]')

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
            if self.film_type == 'anime':
                anime_sql = f"""CREATE TABLE {self.table_name} (
                                    _id VARCHAR(20),
                                    mal_id VARCHAR(10),
                                    title VARCHAR(255),
                                    year VARCHAR(4),
                                    slug VARCHAR(150),
                                    synopsis TEXT,
                                    runtime VARCHAR(4),
                                    status VARCHAR(16),
                                    type VARCHAR(6),
                                    last_updated FLOAT(16,1),
                                    episodes TEXT,
                                    genres VARCHAR(255),
                                    images TEXT,
                                    latest_episode FLOAT(10,1),
                                    rating VARCHAR(255),
                                    num_seasons TINYINT,
                                    _v TINYINT,
                                    PRIMARY KEY(_id)
                                    )"""
                cursor.execute(anime_sql)
            if self.film_type == 'movie':
                movie_sql = f"""CREATE TABLE {self.table_name} (
                                    _id VARCHAR(20),
                                    imdb_id VARCHAR(10),
                                    title VARCHAR(255),
                                    year VARCHAR(4),
                                    slug VARCHAR(150),
                                    synopsis TEXT,
                                    runtime VARCHAR(4),
                                    country VARCHAR(4),
                                    last_updated FLOAT(16,1),
                                    released INT,
                                    certification VARCHAR(255),
                                    torrents TEXT,
                                    trailer VARCHAR(255),
                                    genres VARCHAR(255),
                                    images TEXT,
                                    rating VARCHAR(255),
                                    _v TINYINT,
                                    PRIMARY KEY(_id)
                                    )"""
                cursor.execute(movie_sql)
            if self.film_type == 'show':
                show_sql = f"""CREATE TABLE {self.table_name} (
                                                    _id VARCHAR(20),
                                                    imdb_id VARCHAR(10),
                                                    tvdb_id VARCHAR(10),
                                                    title VARCHAR(255),
                                                    year VARCHAR(4),
                                                    slug VARCHAR(150),
                                                    synopsis TEXT,
                                                    runtime VARCHAR(4),
                                                    country VARCHAR(4),
                                                    network VARCHAR(30),
                                                    air_day VARCHAR(9),
                                                    air_time VARCHAR(5),
                                                    status VARCHAR(16),
                                                    num_seasons TINYINT,
                                                    last_updated FLOAT(16,1),
                                                    episodes LONGTEXT,
                                                    latest_episode FLOAT(10,1),
                                                    genres VARCHAR(255),
                                                    images TEXT,
                                                    rating VARCHAR(255),
                                                    _v TINYINT,
                                                    PRIMARY KEY(_id)
                                                    )"""
                cursor.execute(show_sql)
        except mysql.connector.errors.ProgrammingError as e:
            sys.exit(f'TableCreationError in FilmDatabase#createFilmTable: \n{e} [!]')

    def show_table_cols(self, cursor):
        """Show table columns"""
        cursor.execute(f"SHOW COLUMNS FROM {self.table_name};")
        results = cursor.fetchall()
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
        :param json_film: JSON film of anime, show, or movie
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
            sys.exit(f"AddFilmError in FilmDatabase#addFilm: film below:\n{json_film}\nError: {e}")

    def update_database(self, cursor):
        """
        Returns number films added to the database
        :param cursor: MySQLCursor
        :returns: new_film_count - initial_film_count -> number
        """
        initial_film_count = self.show_film_count(cursor)
        film_list = get_films(self.film_type)
        for movie in film_list:
            self.add_film(cursor, movie)
        new_film_count = self.show_film_count(cursor)
        return new_film_count - initial_film_count


def setup_films(film_type):
    host = 'localhost'
    user = 'anonymous'
    passwd = 'anonymous'
    database = 'backend'
    if mysql_server_running(host='localhost', port=3306):
        film_database = FilmDatabase(host, user, passwd, database, film_type)
        cursor = film_database.cursor()
        if not film_database.exists(cursor):
            film_database.create_database(cursor)
        film_database.use_database(cursor)
        if not film_database.table_exists(cursor):
            film_database.create_film_table(cursor)
        new_film_count = film_database.update_database(cursor)
        print(f"{new_film_count} new {film_type}s were added to the database.")
    else:
        print(f'\n[!] MySQL Server is not running [!]')


if __name__ == '__main__':
    print('What\'s up?')
    # setup_films(film_type='anime')
    # setup_films(film_type='movie')
    # setup_films(film_type='show')
