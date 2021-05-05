import { Pipe, PipeTransform } from '@angular/core';
import { BSCToken } from "../models/crypto";

@Pipe({name: 'bsctoken_socials'})
export class BSCTokenSocialsPipe implements PipeTransform {
  transform(token: BSCToken): any[] {
    let token_socials = [];
    if (token.website != "") {
      let website = { "name": "website", "link": token.website, "icon": "globe-outline", "icon_pack": "eva" };
      token_socials.push(website);
    }
    if (token.whitepaper != "") {
      let whitepaper = {"name": "whitepaper", "link": token.whitepaper, "icon": "file-text-outline", "icon_pack": "eva"};
      token_socials.push(whitepaper);
    }
    if (token.socials?.blog != "") {
      let blog = {"name": "blog", "link": token.socials?.blog, "icon": "monitor-outline", "icon_pack": "eva"};
      token_socials.push(blog);
    }
    if (token.socials?.reddit != "") {
      let reddit = {"name": "reddit", "link": token.socials?.reddit, "icon": "reddit-alien", "icon_pack": "font-awesome"};
      token_socials.push(reddit);
    }
    if (token.socials?.facebook != "") {
      let facebook = {"name": "facebook", "link": token.socials?.facebook, "icon": "facebook-outline", "icon_pack": "eva"};
      token_socials.push(facebook);
    }
    if (token.socials?.twitter != "") {
      let twitter = {"name": "twitter", "link": token.socials?.twitter, "icon": "twitter-outline", "icon_pack": "eva"};
      token_socials.push(twitter);
    }
    if (token.socials?.github != "") {
      let github = {"name": "github", "link": token.socials?.github, "icon": "github-outline", "icon_pack": "eva"};
      token_socials.push(github);
    }
    if (token.socials?.telegram != "") {
      let telegram = {"name": "telegram", "link": token.socials?.telegram, "icon": "telegram", "icon_pack": "font-awesome"};
      token_socials.push(telegram);
    }
    if (token.socials?.linkedin != "") {
      let linkedin = {"name": "linkedin", "link": token.socials?.linkedin, "icon": "linkedin-outline", "icon_pack": "eva"};
      token_socials.push(linkedin);
    }
    if (token.socials?.discord != "") {
      let discord = {"name": "discord", "link": token.socials?.discord, "icon": "discord", "icon_pack": "custom-icons"};
      token_socials.push(discord);
    }
    return token_socials
  }
}
