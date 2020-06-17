import { Injectable } from '@angular/core'
import { Profile } from './card/card'
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AppService {

  profiles: Profile[] = [
    {
      name: "Jane Doe",
      profession: "Framework Developer",
      motto: "I never wanted to be famous, I wanted to be great.",
      photo: "default.png"
    },
    {
      name: "Kurtis Weissnat",
      profession: "Developer",
      motto: "When in doubt, iterate faster!",
      photo: "default.png"
    },
    {
      name: "Chelsey Dietrich",
      profession: "UX Developer",
      motto: "Genius is the ability to reduce the complicated to the simple.",
      photo: "default.png"
    },
    {
      name: "Leanne Graham",
      profession: "UI Developer",
      motto: "The key to performance is elegance, not battalions of special cases.",
      photo: "default.png"
    }
  ]

  getProfiles() {
    return of(this.profiles)
  }

  getProfilesByName(name: string) {
    return of(this.profiles.filter(profile => {
      return profile.name.toLowerCase().includes(name.toLowerCase())
    }))
  }

}