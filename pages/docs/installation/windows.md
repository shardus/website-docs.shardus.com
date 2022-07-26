import Callout from 'nextra-theme-docs/callout'
import Bleed from 'nextra-theme-docs/bleed'

# Windows Pre-Install

We highly recommend all Windows users to use the Windows Subsystem for Linux version 2 (latest version).

In order to install the Windows Subsystem for Linux, you need to be running Windows version 2004 or later. Make sure your Windows computer is up to date.

1. Search for `Turn Windows features on or off` in the search bar.
2. Make sure `Virtual Machine Platform` and `Windows Subsystem for Linux` boxes are enabled.
3. Click `OK` and reboot your computer when prompted to do so.
4. After reboot, go to the Windows store and search for `Ubuntu-20.04` or whatever version of Linux you wish to use. (We recommend `Ubuntu-20.04`.)
5. Now open up `Powershell` as an admin user and run the command `wsl --set-version <distro> 2` in order to update `wsl` to the latest version which, at the time of writing, is version 2. `<distro>` refers to the Linux distribution that you decided to use with `wsl`; in our example, it was `Ubuntu-20.04`.
6. Finally, open up the Linux distribution and continue the [installation](setup) steps we have for Linux.

<Callout emoji="🚨" type="error">

Windows Subsystem for Linux 2 has much faster performance, especially when running commands like `npm install` (OR `yarn install`). If you have any trouble with the steps above, please check out this video for another helpful [guide](https://www.youtube.com/watch?v=_fntjriRe48).

</Callout>
