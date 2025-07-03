export * from './accessories';
export * from './armours';
export * from './weapons';
export * from './shields';

import type { Accessory } from './accessories';
import type { Armour } from './armours';
import type { Weapon } from './weapons';
import type { Shield } from './shields';

export type Equipment = Armour | Accessory | Shield | Weapon;
