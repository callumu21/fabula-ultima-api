export * from './weapons';
export * from './armour';
export * from './shields';

import type { Weapon } from './weapons';
import type { Armour } from './armour';
import type { Shield } from './shields';

export type Equipment = Weapon | Armour | Shield;
