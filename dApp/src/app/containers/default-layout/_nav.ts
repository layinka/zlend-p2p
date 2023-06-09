import { INavData } from '@coreui/angular';
import { IconComponent } from '@coreui/icons-angular';
import { url } from 'inspector';

export const navItems: INavData[] = [
  // {
  //   name: 'Dashboard',
  //   url: '/dashboard',
  //   iconComponent: { name: 'cil-speedometer' },
  //   badge: {
  //     color: 'info',
  //     text: 'NEW'
  //   }
  // },

  {
    name: 'Home',
    url: '/home',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },

  {
    title: true,
    name: 'Vault Owner'
  },
  {
    name: 'Create A Vault',
    url: '/vaults/create-vault', 
    iconComponent: { name: 'cil-dollar' }
  },
  {
    name: 'View Vaults ',
    url: '/vaults/list',
    iconComponent: { name: 'cil-paper-plane'}
  },
  {
    title: true,
    name: 'Signatory'
  },
  {
    name: 'Become a Signatory',
    url: '/signatory/create-signatory',
    iconComponent: { name: 'cil-lock-locked'},
  },
  {
    name: 'View Signatories',
    url: '/signatory',
    iconComponent: { name: 'cil-paper-plane'}
  },
  // {
  //   title: true,
  //   name: 'Beneficiary'
  // },
  // {
  //   name: 'Create Beneficiary Account',
  //   url: '/beneficiary/create-beneficiary',
  //   iconComponent: { name: 'cil-lock-locked'},
  // },
  // {
  //   name: 'Beneficiary Details',
  //   url: '/beneficiary/beneficiary-details',
  //   iconComponent: {name: 'cil-paper-plane'},
  //   badge: {
  //     color: 'secondary',
  //     text: 'Coming Soon'
  //   }
  // },
  {
    title: true,
    name: 'Docs'
  },
  {
    name: 'Docs',
    url: '/docs/docs-main',
    iconComponent: { name: 'cil-drop'},
    badge: {
      color: 'secondary',
      text: 'COMING SOON'
    }
    
  }
];
