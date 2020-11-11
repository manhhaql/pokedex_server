drop database if exists pokedex;
create database pokedex;
use pokedex;

drop table if exists users;
create table if not exists users (
	id int auto_increment,
    avatar text collate utf8_unicode_ci default null,
    username varchar(50) collate utf8_unicode_ci not null,
    email varchar(50) collate utf8_unicode_ci default null,
    password text collate utf8_unicode_ci not null,
    salt varchar(255) collate utf8_unicode_ci default null,
	type tinyint default 2,
    status tinyint default 1,
    created_at timestamp null default null,
    updated_at timestamp null default null,
    primary key(id)
);

DROP TRIGGER  IF EXISTS before_insert_users;
delimiter ;; 
	create trigger before_insert_user before insert on users 
	for each row 
	begin
    set new.created_at = current_timestamp; 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 

DROP TRIGGER  IF EXISTS before_update_users;
delimiter ;; 
	create trigger before_update_user before update on users 
	for each row 
	begin 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 
insert into users (username, password, salt,type, status) values ('admin', '66ce5690f02403bef897b6f5d7c7028141691681dd3cff331c920df17c02bb97', 'fcc243436e03d96623a6', 1, 1)

-- AUTHENTICATION_SESSION
drop table if exists authentication_session;
create table if not exists authentication_session (
	id int auto_increment,
    user_id int not null,
    token varchar(255) not null,
    status tinyint default 1,
    created_at timestamp null default null,
    updated_at timestamp null default null,
    primary key (id),
    foreign key (user_id) REFERENCES users(id) on update cascade on delete restrict
);
delimiter ;; 
	create trigger before_insert_authentication_session before insert on authentication_session 
	for each row 
	begin
    set new.created_at = current_timestamp; 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 
delimiter ;; 
	create trigger before_update_authentication_session before update on authentication_session 
	for each row 
	begin 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ;

-- TYPES
drop table if exists types;
create table if not exists types (
	id int auto_increment,
    name varchar(50) collate utf8_unicode_ci default null,
    created_at timestamp null default null,
    updated_at timestamp null default null,
    primary key(id)
);

DROP TRIGGER  IF EXISTS before_insert_types;
delimiter ;; 
	create trigger before_insert_types before insert on types 
	for each row 
	begin
    set new.created_at = current_timestamp; 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 

DROP TRIGGER  IF EXISTS before_update_types;
delimiter ;; 
	create trigger before_update_types before update on types 
	for each row 
	begin 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 

insert into types (name) 
values
('Normal'),
('Fire'),
('Water'),
('Grass'),
('Electric'),
('Ice'),
('Fighting'),
('Poison'),
('Ground'),
('Flying'),
('Psychic'),
('Bug'),
('Rock'),
('Ghost'),
('Dark'),
('Dragon'),
('Steel'),
('Fairy')

-- WEAKNESS
drop table if exists weakness;
create table if not exists weakness (
	id int auto_increment,
    name varchar(50) collate utf8_unicode_ci default null,
    created_at timestamp null default null,
    updated_at timestamp null default null,
    primary key(id)
);

DROP TRIGGER  IF EXISTS before_insert_weakness;
delimiter ;; 
	create trigger before_insert_weakness before insert on weakness 
	for each row 
	begin
    set new.created_at = current_timestamp; 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 

DROP TRIGGER  IF EXISTS before_update_weakness;
delimiter ;; 
	create trigger before_update_weakness before update on weakness 
	for each row 
	begin 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ;

insert into weakness (name) 
values
('Normal'),
('Fire'),
('Water'),
('Grass'),
('Electric'),
('Ice'),
('Fighting'),
('Poison'),
('Ground'),
('Flying'),
('Psychic'),
('Bug'),
('Rock'),
('Ghost'),
('Dark'),
('Dragon'),
('Steel'),
('Fairy')

-- ABILITY
drop table if exists ability;
create table if not exists ability (
	id int auto_increment,
	name varchar(50) collate utf8_unicode_ci default null,
    description text collate utf8_unicode_ci default null,
    created_at timestamp null default null,
    updated_at timestamp null default null,
    primary key(id)
);

DROP TRIGGER  IF EXISTS before_insert_ability;
delimiter ;; 
	create trigger before_insert_ability before insert on ability 
	for each row 
	begin
    set new.created_at = current_timestamp; 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 

DROP TRIGGER  IF EXISTS before_update_ability;
delimiter ;; 
	create trigger before_update_ability before update on ability 
	for each row 
	begin 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 

insert into ability (name, description) 
values 
('Stench', 'By releasing stench when attacking, this Pokémon may cause the target to flinch.'),
('Drizzle', 'The Pokémon makes it rain when it enters a battle.'),
('Speed Boost', 'Its Speed stat is boosted every turn.'),
('Battle Armor', 'Hard armor protects the Pokémon from critical hits.'),
('Sturdy', 'It cannot be knocked out with one hit. One-hit KO moves cannot knock it out, either.'),
('Damp', 'Prevents the use of explosive moves, such as Self-Destruct, by dampening its surroundings.'),
('Limber', 'Its limber body protects the Pokémon from paralysis.'),
('Sand Veil', "Boosts the Pokémon's evasiveness in a sandstorm."),
('Static', 'The Pokémon is charged with static electricity, so contact with it may cause paralysis.'),
('Volt Absorb', 'Restores HP if hit by an Electric-type move instead of taking damage.'),
('Water Absorb', 'Restores HP if hit by a Water-type move instead of taking damage.'),
('Oblivious', 'The Pokémon is oblivious, and that keeps it from being infatuated or falling for taunts.'),
('Cloud Nine', 'Eliminates the effects of weather.'),
('Compound Eyes', "The Pokémon's compound eyes boost its accuracy."),
('Insomnia', 'The Pokémon is suffering from insomnia and cannot fall asleep.'),
('Color Change', "The Pokémon's type becomes the type of the move used on it."),
('Immunity', 'The immune system of the Pokémon prevents it from getting poisoned.'),
('Flash Fire', "Powers up the Pokémon's Fire-type moves if it's hit by one."),
('Shield Dust', "This Pokémon's dust blocks the additional effects of attacks taken."),
('Own Tempo', "This Pokémon has its own tempo, and that prevents it from becoming confused."),
('Suction Cups', "This Pokémon uses suction cups to stay in one spot to negate all moves and items that force switching out.	"),
('Intimidate', "The Pokémon intimidates opposing Pokémon upon entering battle, lowering their Attack stat."),
('Shadow Tag', "This Pokémon steps on the opposing Pokémon's shadow to prevent it from escaping."),
('Rough Skin', "This Pokémon inflicts damage with its rough skin to the attacker on contact."),
('Wonder Guard', "Its mysterious power only lets supereffective moves hit the Pokémon."),
('Levitate', "By floating in the air, the Pokémon receives full immunity to all Ground-type moves."),
('Effect Spore', "Contact with the Pokémon may inflict poison, sleep, or paralysis on its attacker."),
('Synchronize', "The attacker will receive the same status condition if it inflicts a burn, poison, or paralysis to the Pokémon.	"),
('Clear Body', "Prevents other Pokémon's moves or Abilities from lowering the Pokémon's stats."),
('Natural Cure', "All status conditions heal when the Pokémon switches out."),
('Lightning Rod', "The Pokémon draws in all Electric-type moves. Instead of being hit by Electric-type moves, it boosts its Sp. Atk."),
('Serene Grace', "Boosts the likelihood of additional effects occurring when attacking."),
('Swift Swim', "Boosts the Pokémon's Speed stat in rain."),
('Chlorophyll', "Boosts the Pokémon's Speed stat in harsh sunlight."),
('Illuminate', "Raises the likelihood of meeting wild Pokémon by illuminating the surroundings."),
('Trace', "When it enters a battle, the Pokémon copies an opposing Pokémon's Ability."),
('Huge Power', "Doubles the Pokémon's Attack stat."),
('Poison Point', "Contact with the Pokémon may poison the attacker."),
('Inner Focus', "The Pokémon's intensely focused, and that protects the Pokémon from flinching."),
('Magma Armor', "The Pokémon is covered with hot magma, which prevents the Pokémon from becoming frozen."),
('Water Veil', "The Pokémon is covered with a water veil, which prevents the Pokémon from getting a burn.	"),
('Magnet Pull', "Prevents Steel-type Pokémon from escaping using its magnetic force."),
('Soundproof', "Soundproofing gives the Pokémon full immunity to all sound-based moves."),
('Rain Dish', "The Pokémon gradually regains HP in rain."),
('Sand Stream', "The Pokémon summons a sandstorm when it enters a battle."),
('Pressure', "By putting pressure on the opposing Pokémon, it raises their PP usage."),
('Thick Fat', "The Pokémon is protected by a layer of thick fat, which halves the damage taken from Fire- and Ice-type moves."),
('Early Bird', "The Pokémon awakens from sleep twice as fast as other Pokémon."),
('Flame Body', "Contact with the Pokémon may burn the attacker."),
('Run Away', "Enables a sure getaway from wild Pokémon."),
('Keen Eye', "Keen eyes prevent other Pokémon from lowering this Pokémon's accuracy."),
('Hyper Cutter', "The Pokémon's proud of its powerful pincers. They prevent other Pokémon from lowering its Attack stat."),
('Pickup', "The Pokémon may pick up the item an opposing Pokémon used during a battle. It may pick up items outside of battle, too."),
('Truant', "The Pokémon can't use a move if it had used a move on the previous turn."),
('Hustle', "Boosts the Attack stat, but lowers accuracy."),
('Cute Charm', "Contact with the Pokémon may cause infatuation."),
('Plus', "	Boosts the Sp. Atk stat of the Pokémon if an ally with the Plus or Minus Ability is also in battle."),
('Minus', "Boosts the Sp. Atk stat of the Pokémon if an ally with the Plus or Minus Ability is also in battle."),
('Forecast', "The Pokémon transforms with the weather to change its type to Water, Fire, or Ice."),
('Sticky Hold', "Items held by the Pokémon are stuck fast and cannot be removed by other Pokémon."),
('Shed Skin', "The Pokémon may heal its own status conditions by shedding its skin."),
('Guts', "It's so gutsy that having a status condition boosts the Pokémon's Attack stat."),
('Marvel Scale', "The Pokémon's marvelous scales boost the Defense stat if it has a status condition."),
('Liquid Ooze', "The oozed liquid has a strong stench, which damages attackers using any draining move."),
('Overgrow', "Powers up Grass-type moves when the Pokémon's HP is low."),
('Blaze', "Powers up Fire-type moves when the Pokémon's HP is low."),
('Torrent', "Powers up Water-type moves when the Pokémon's HP is low."),
('Swarm', "Powers up Bug-type moves when the Pokémon's HP is low."),
('Rock Head', "Protects the Pokémon from recoil damage."),
('Drought', "Turns the sunlight harsh when the Pokémon enters a battle."),
('Arena Trap', "Prevents opposing Pokémon from fleeing."),
('Vital Spirit', "The Pokémon is full of vitality, and that prevents it from falling asleep."),
('White Smoke', "The Pokémon is protected by its white smoke, which prevents other Pokémon from lowering its stats.	"),
('Pure Power', "Using its pure power, the Pokémon doubles its Attack stat."),
('Shell Armor', "A hard shell protects the Pokémon from critical hits."),
('Air Lock', "Eliminates the effects of weather."),
('Tangled Feet', "Raises evasiveness if the Pokémon is confused."),
('Motor Drive', "Boosts its Speed stat if hit by an Electric-type move instead of taking damage."),
('Rivalry', "Becomes competitive and deals more damage to Pokémon of the same gender, but deals less to Pokémon of the opposite gender."),
('Steadfast', "The Pokémon's determination boosts the Speed stat each time the Pokémon flinches."),
('Snow Cloak', "Boosts evasiveness in a hailstorm."),
('Gluttony', "Makes the Pokémon eat a held Berry when its HP drops to half or less, which is sooner than usual."),
('Anger Point', "The Pokémon is angered when it takes a critical hit, and that maxes its Attack stat."),
('Unburden', "Boosts the Speed stat if the Pokémon's held item is used or lost."),
('Heatproof', "The heatproof body of the Pokémon halves the damage from Fire-type moves that hit it."),
('Simple', "The stat changes the Pokémon receives are doubled."),
('Dry Skin', "Restores HP in rain or when hit by Water-type moves. Reduces HP in harsh sunlight, and increases the damage received from Fire-type moves."),
('Download', "ompares an opposing Pokémon's Defense and Sp. Def stats before raising its own Attack or Sp. Atk stat—whichever will be more effective."),
('Iron Fist', "Powers up punching moves."),
('Poison Heal', "Restores HP if the Pokémon is poisoned instead of losing HP."),
('Adaptability', "Powers up moves of the same type as the Pokémon."),
('Skill Link', "Maximizes the number of times multistrike moves hit."),
('Hydration', "Heals status conditions if it's raining."),
('Solar Power', "Boosts the Sp. Atk stat in harsh sunlight, but HP decreases every turn."),
('Quick Feet', "Boosts the Speed stat if the Pokémon has a status condition."),
('Normalize', "All the Pokémon's moves become Normal type. The power of those moves is boosted a little."),
('Sniper', "Powers up moves if they become critical hits when attacking."),
('Magic Guard', "The Pokémon only takes damage from attacks."),
('No Guard', "The Pokémon employs no-guard tactics to ensure incoming and outgoing attacks always land."),
('Stall', "The Pokémon moves after all other Pokémon do."),
('Technician', "Powers up the Pokémon's weaker moves."),
('Leaf Guard', "Prevents status conditions in harsh sunlight."),
('Klutz', "The Pokémon can't use any held items."),
('Mold Breaker', "Moves can be used on the target regardless of its Abilities."),
('Super Luck', "The Pokémon is so lucky that the critical-hit ratios of its moves are boosted."),
('Aftermath', "Damages the attacker if it contacts the Pokémon with a finishing hit."),
('Anticipation', "The Pokémon can sense an opposing Pokémon's dangerous moves."),
('Forewarn', "When it enters a battle, the Pokémon can tell one of the moves an opposing Pokémon has."),
('Unaware', "When attacking, the Pokémon ignores the target Pokémon's stat changes."),
('Tinted Lens', 'The Pokémon can use "not very effective" moves to deal regular damage.'),
('Filter', "Reduces the power of supereffective attacks taken."),
('Slow Start', "For five turns, the Pokémon's Attack and Speed stats are halved."),
('Scrappy', "The Pokémon can hit Ghost-type Pokémon with Normal- and Fighting-type moves."),
('Storm Drain', "Draws in all Water-type moves. Instead of being hit by Water-type moves, it boosts its Sp. Atk."),
('Ice Body', "The Pokémon gradually regains HP in a hailstorm."),
('Solid Rock', "Reduces the power of supereffective attacks taken."),
('Snow Warning', "The Pokémon summons a hailstorm when it enters a battle."),
('Honey Gather', "The Pokémon may gather Honey after a battle."),
('Frisk', "When it enters a battle, the Pokémon can check an opposing Pokémon's held item."),
('Reckless', "Powers up moves that have recoil damage."),
('Multitype', "Changes the Pokémon's type to match the Plate or Z-Crystal it holds."),
('Flower Gift', "Boosts the Attack and Sp. Def stats of itself and allies in harsh sunlight."),
('Bad Dreams', "Reduces the HP of sleeping opposing Pokémon."),
('Pickpocket', "Steals an item from an attacker that made direct contact."),
('Sheer Force', "Removes additional effects to increase the power of moves when attacking."),
('Contrary', "Makes stat changes have an opposite effect."),
('Unnerve', "Unnerves opposing Pokémon and makes them unable to eat Berries."),
('Defiant', "Boosts the Pokémon's Attack stat sharply when its stats are lowered."),
('Defeatist', "Halves the Pokémon's Attack and Sp. Atk stats when its HP becomes half or less."),
('Cursed Body', "May disable a move used on the Pokémon."),
('Healer', "Sometimes heals an ally's status condition."),
('Friend Guard', "Reduces damage done to allies."),
('Weak Armor', "Physical attacks to the Pokémon lower its Defense stat but sharply raise its Speed stat."),
('Heavy Metal', "Doubles the Pokémon's weight."),
('Light Metal', "Halves the Pokémon's weight."),
('Multiscale', "Reduces the amount of damage the Pokémon takes while its HP is full."),
('Toxic Boost', "Powers up physical attacks when the Pokémon is poisoned."),
('Flare Boost', "Powers up special attacks when the Pokémon is burned."),
('Harvest', "May create another Berry after one is used."),
('Telepathy', "Anticipates an ally's attack and dodges it."),
('Moody', "Raises one stat sharply and lowers another every turn."),
('Overcoat', "Protects the Pokémon from things like sand, hail, and powder."),
('Poison Touch', "May poison a target when the Pokémon makes contact."),
('Regenerator', "Restores a little HP when withdrawn from battle."),
('Big Pecks', "Protects the Pokémon from Defense-lowering effects."),
('Sand Rush', "Boosts the Pokémon's Speed stat in a sandstorm."),
('Wonder Skin', "Makes status moves more likely to miss."),
('Analytic', "Boosts move power when the Pokémon moves last."),
('Illusion', "Comes out disguised as the Pokémon in the party's last spot."),
('Imposter', "The Pokémon transforms itself into the Pokémon it's facing."),
('Infiltrator', "Passes through the opposing Pokémon's barrier, substitute, and the like and strikes."),
('Mummy', "Contact with the Pokémon changes the attacker's Ability to Mummy."),
('Moxie', "The Pokémon shows moxie, and that boosts the Attack stat after knocking out any Pokémon."),
('Justified', "Being hit by a Dark-type move boosts the Attack stat of the Pokémon, for justice."),
('Rattled', "Dark-, Ghost-, and Bug-type moves scare the Pokémon and boost its Speed stat."),
('Magic Bounce', "Reflects status moves instead of getting hit by them."),
('Sap Sipper', "Boosts the Attack stat if hit by a Grass-type move instead of taking damage."),
('Prankster', "Gives priority to a status move."),
('Sand Force', "Boosts the power of Rock-, Ground-, and Steel-type moves in a sandstorm."),
('Iron Barbs', "Inflicts damage on the attacker upon contact with iron barbs."),
('Zen Mode', "Changes the Pokémon's shape when HP is half or less."),
('Victory Star', "Boosts the accuracy of its allies and itself."),
('Turboblaze', "Moves can be used on the target regardless of its Abilities."),
('Teravolt', "Moves can be used on the target regardless of its Abilities."),
('Aroma Veil', "Protects itself and its allies from attacks that limit their move choices."),
('Flower Veil', "Ally Grass-type Pokémon are protected from status conditions and the lowering of their stats."),
('Cheek Pouch	', "Restores HP as well when the Pokémon eats a Berry."),
('Protean', "Changes the Pokémon's type to the type of the move it's about to use."),
('Fur Coat', "Halves the damage from physical moves."),
('Magician', "The Pokémon steals the held item of a Pokémon it hits with a move."),
('Bulletproof', "Protects the Pokémon from some ball and bomb moves."),
('Competitive', "Boosts the Sp. Atk stat sharply when a stat is lowered."),
('Strong Jaw', "The Pokémon's strong jaw boosts the power of its biting moves."),
('Refrigerate', "Normal-type moves become Ice-type moves. The power of those moves is boosted a little."),
('Sweet Veil', "Prevents itself and ally Pokémon from falling asleep."),
('Stance Change', "The Pokémon changes its form to Blade Forme when it uses an attack move and changes to Shield Forme when it uses King's Shield."),
('Gale Wings', "Gives priority to Flying-type moves when the Pokémon's HP is full."),
('Mega Launcher', "	Powers up aura and pulse moves."),
('Grass Pelt', "Boosts the Pokémon's Defense stat on Grassy Terrain."),
('Symbiosis', "The Pokémon passes its item to an ally that has used up an item."),
('Tough Claws', "Powers up moves that make direct contact."),
('Pixilate', "Normal-type moves become Fairy-type moves. The power of those moves is boosted a little."),
('Gooey', "Contact with the Pokémon lowers the attacker's Speed stat."),
('Aerilate', "Normal-type moves become Flying-type moves. The power of those moves is boosted a little."),
('Parental Bond', "Parent and child each attacks."),
('Dark Aura', "Powers up each Pokémon's Dark-type moves."),
('Fairy Aura', "Powers up each Pokémon's Fairy-type moves."),
('Aura Break', 'The effects of "Aura" Abilities are reversed to lower the power of affected moves.'),
('Primordial Sea', "The Pokémon changes the weather to nullify Fire-type attacks."),
('Desolate Land', "The Pokémon changes the weather to nullify Water-type attacks."),
('Delta Stream', "The Pokémon changes the weather to eliminate all of the Flying type's weaknesses."),
('Stamina', "Boosts the Defense stat when hit by an attack."),
('Wimp Out', "The Pokémon cowardly switches out when its HP becomes half or less."),
('Emergency Exit', "The Pokémon, sensing danger, switches out when its HP becomes half or less."),
('Water Compaction', "Boosts the Pokémon's Defense stat sharply when hit by a Water-type move."),
('Merciless', "The Pokémon's attacks become critical hits if the target is poisoned."),
('Shields Down', "When its HP becomes half or less, the Pokémon's shell breaks and it becomes aggressive."),
('Stakeout', "Doubles the damage dealt to the target's replacement if the target switches out."),
('Water Bubble', "Lowers the power of Fire-type moves done to the Pokémon and prevents the Pokémon from getting a burn."),
('Steelworker', "Powers up Steel-type moves."),
('Berserk', "Boosts the Pokémon's Sp. Atk stat when it takes a hit that causes its HP to become half or less."),
('Slush Rush', "Boosts the Pokémon's Speed stat in a hailstorm."),
('Long Reach', "The Pokémon uses its moves without making contact with the target."),
('Liquid Voice', "All sound-based moves become Water-type moves."),
('Triage', "Gives priority to a healing move."),
('Galvanize', "Normal-type moves become Electric-type moves. The power of those moves is boosted a little."),
('Surge Surfer', "Doubles the Pokémon's Speed stat on Electric Terrain."),
('Schooling', "When it has a lot of HP, the Pokémon forms a powerful school. It stops schooling when its HP is low.	"),
('Disguise', "Once per battle, the shroud that covers the Pokémon can protect it from an attack."),
('Battle Bond', "Defeating an opposing Pokémon strengthens the Pokémon's bond with its Trainer, and it becomes Ash-Greninja. Water Shuriken gets more powerful."),
('Power Construct', "Other Cells gather to aid when its HP becomes half or less. Then the Pokémon changes its form to Complete Forme."),
('Corrosion', "The Pokémon can poison the target even if it's a Steel or Poison type."),
('Comatose', "It's always drowsing and will never wake up. It can attack without waking up."),
('Queenly Majesty', "Its majesty pressures the opposing Pokémon, making it unable to attack using priority moves."),
('Innards Out', "Damages the attacker landing the finishing hit by the amount equal to its last HP."),
('Dancer', "When another Pokémon uses a dance move, it can use a dance move following it regardless of its Speed.	"),
('Battery', "Powers up ally Pokémon's special moves."),
('Fluffy', "Halves the damage taken from moves that make direct contact, but doubles that of Fire-type moves."),
('Dazzling', "Surprises the opposing Pokémon, making it unable to attack using priority moves."),
('Soul-Heart', "Boosts its Sp. Atk stat every time a Pokémon faints."),
('Tangling Hair', "Contact with the Pokémon lowers the attacker's Speed stat."),
('Receiver', "The Pokémon copies the Ability of a defeated ally."),
('Power of Alchemy', "The Pokémon copies the Ability of a defeated ally."),
('Beast Boost', "The Pokémon boosts its most proficient stat each time it knocks out a Pokémon."),
('RKS System', "Changes the Pokémon's type to match the memory disc it holds."),
('Electric Surge', "Turns the ground into Electric Terrain when the Pokémon enters a battle."),
('Psychic Surge', "Turns the ground into Psychic Terrain when the Pokémon enters a battle."),
('Misty Surge', "Turns the ground into Misty Terrain when the Pokémon enters a battle."),
('Grassy Surge', "Turns the ground into Grassy Terrain when the Pokémon enters a battle."),
('Full Metal Body', "Prevents other Pokémon's moves or Abilities from lowering the Pokémon's stats."),
('Shadow Shield', "Reduces the amount of damage the Pokémon takes while its HP is full."),
('Prism Armor', "Reduces the power of supereffective attacks taken."),
('Neuroforce', "Powers up moves that are super effective."),
('Intrepid Sword', "Boosts the Pokémon's Attack stat when the Pokémon enters a battle."),
('Dauntless Shield', "Boosts the Pokémon's Defense stat when the Pokémon enters a battle."),
('Libero', "Changes the Pokémon's type to the type of the move it's about to use."),
('Ball Fetch', "If the Pokémon is not holding an item, it will fetch the Poké Ball from the first failed throw of the battle.	"),
('Cotton Down', "When the Pokémon is hit by an attack, it scatters cotton fluff around and lowers the Speed stat of all Pokémon except itself."),
('Propeller Tail', "Ignores the effects of opposing Pokémon's Abilities and moves that draw in moves."),
('Mirror Armor', "Bounces back only the stat-lowering effects that the Pokémon receives."),
('Gulp Missile', "When the Pokémon uses Surf or Dive, it will come back with prey. When it takes damage, it will spit out the prey to attack."),
('Stalwart', "Ignores the effects of opposing Pokémon's Abilities and moves that draw in moves."),
('Steam Engine', "Boosts the Pokémon's Speed stat drastically if hit by a Fire- or Water-type move."),
('Punk Rock', "Boosts the power of sound-based moves. The Pokémon also takes half the damage from these kinds of moves."),
('Sand Spit', "The Pokémon creates a sandstorm when it's hit by an attack."),
('Ice Scales', "The Pokémon is protected by ice scales, which halve the damage taken from special moves.	"),
('Ripen', "Ripens Berries and doubles their effect."),
('Ice Face', "The Pokémon's ice head can take a physical attack as a substitute, but the attack also changes the Pokémon's appearance. The ice will be restored when it hails."),
('Power Spot', "Just being next to the Pokémon powers up moves."),
('Mimicry', "Changes the Pokémon's type depending on the terrain."),
('Screen Cleaner', "When the Pokémon enters a battle, the effects of Light Screen, Reflect, and Aurora Veil are nullified for both opposing and ally Pokémon."),
('Steely Spirit', "Powers up ally Pokémon's Steel-type moves."),
('Perish Body', "When hit by a move that makes direct contact, the Pokémon and the attacker will faint after three turns unless they switch out of battle."),
('Wandering Spirit', "The Pokémon exchanges Abilities with a Pokémon that hits it with a move that makes direct contact."),
('Gorilla Tactics', "Boosts the Pokémon's Attack stat but only allows the use of the first selected move."),
('Neutralizing Gas', "	If the Pokémon with Neutralizing Gas is in the battle, the effects of all Pokémon's Abilities will be nullified or will not be triggered."),
('Pastel Veil', "Protects the Pokémon and its ally Pokémon from being poisoned."),
('Hunger Switch', "The Pokémon changes its form, alternating between its Full Belly Mode and Hangry Mode after the end of each turn."),
('Quick Draw', "Enables the Pokémon to move first occasionally."),
('Unseen Fist', "If the Pokémon uses moves that make direct contact, it can attack the target even if the target protects itself.	"),
('Curious Medicine', "When the Pokémon enters a battle, it scatters medicine from its shell, which removes all stat changes from allies."),
('Transistor', "Powers up Electric-type moves."),
("Dragon's Maw", "Powers up Dragon-type moves."),
('Chilling Neigh', "When the Pokémon knocks out a target, it utters a chilling neigh, which boosts its Attack stat."),
('Grim Neigh', "When the Pokémon knocks out a target, it utters a terrifying neigh, which boosts its Sp. Atk stat."),
('As One', "This Ability combines the effects of both Calyrex's Unnerve Ability and Glastrier's Chilling Neigh Ability/Spectrier's Grim Neigh Ability.")

-- POKEMON
drop table if exists pokemon;
create table if not exists pokemon (
	id int auto_increment,
    name varchar(50) collate utf8_unicode_ci not null unique,
    tag varchar(50) collate utf8_unicode_ci not null,
	stage tinyint not null default 1,
	of_basic int default null,
	height int default null,
	weight int default null,
    gender int default 3,
	status tinyint not null default 1,
    created_at timestamp null default null,
    updated_at timestamp null default null,
    primary key(id)
);

DROP TRIGGER  IF EXISTS before_insert_pokemon;
delimiter ;; 
	create trigger before_insert_pokemon before insert on pokemon 
	for each row 
	begin
    set new.created_at = current_timestamp; 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 

DROP TRIGGER  IF EXISTS before_update_pokemon;
delimiter ;; 
	create trigger before_update_pokemon before update on pokemon 
	for each row 
	begin 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 


-- POKEMON_TYPE
drop table if exists pokemon_type;
create table if not exists pokemon_type (
	id int auto_increment,
    pokemon_id int not null,
    type_id int not null,
    created_at timestamp null default null,
    updated_at timestamp null default null,
    primary key(id),
	foreign key (pokemon_id) REFERENCES pokemon(id) on update cascade on delete restrict,
	foreign key (type_id) REFERENCES types(id) on update cascade on delete restrict
);

DROP TRIGGER  IF EXISTS before_insert_pokemon_type;
delimiter ;; 
	create trigger before_insert_pokemon_type before insert on pokemon_type 
	for each row 
	begin
    set new.created_at = current_timestamp; 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 

DROP TRIGGER  IF EXISTS before_update_pokemon_type;
delimiter ;; 
	create trigger before_update_pokemon_type before update on pokemon_type 
	for each row 
	begin 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 

-- POKEMON_WEAKNESS
drop table if exists pokemon_weakness;
create table if not exists pokemon_weakness (
	id int auto_increment,
    pokemon_id int not null,
    weakness_id int not null,
    created_at timestamp null default null,
    updated_at timestamp null default null,
    primary key(id),
	foreign key (pokemon_id) REFERENCES pokemon(id) on update cascade on delete restrict,
	foreign key (weakness_id) REFERENCES weakness(id) on update cascade on delete restrict
);

DROP TRIGGER  IF EXISTS before_insert_pokemon_weakness;
delimiter ;; 
	create trigger before_insert_pokemon_weakness before insert on pokemon_weakness 
	for each row 
	begin
    set new.created_at = current_timestamp; 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 

DROP TRIGGER  IF EXISTS before_update_pokemon_weakness;
delimiter ;; 
	create trigger before_update_pokemon_weakness before update on pokemon_type 
	for each row 
	begin 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 

-- POKEMON_ABILITY
drop table if exists pokemon_ability;
create table if not exists pokemon_ability (
	id int auto_increment,
    pokemon_id int not null,
    ability_id int not null,
    created_at timestamp null default null,
    updated_at timestamp null default null,
    primary key(id),
	foreign key (pokemon_id) REFERENCES pokemon(id) on update cascade on delete restrict,
	foreign key (ability_id) REFERENCES ability(id) on update cascade on delete restrict
);

DROP TRIGGER  IF EXISTS before_insert_pokemon_ability;
delimiter ;; 
	create trigger before_insert_pokemon_ability before insert on pokemon_ability 
	for each row 
	begin
    set new.created_at = current_timestamp; 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 

DROP TRIGGER  IF EXISTS before_update_pokemon_ability;
delimiter ;; 
	create trigger before_update_pokemon_ability before update on pokemon_ability 
	for each row 
	begin 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 

-- POKEMON_IMAGE
drop table if exists pokemon_image;
create table if not exists pokemon_image (
	id int auto_increment,
    pokemon_id int not null,
    url text not null,
    created_at timestamp null default null,
    updated_at timestamp null default null,
    primary key(id),
	foreign key (pokemon_id) REFERENCES pokemon(id) on update cascade on delete restrict
);

DROP TRIGGER  IF EXISTS before_insert_pokemon_image;
delimiter ;; 
	create trigger before_insert_pokemon_image before insert on pokemon_image 
	for each row 
	begin
    set new.created_at = current_timestamp; 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ; 

DROP TRIGGER  IF EXISTS before_update_pokemon_image;
delimiter ;; 
	create trigger before_update_pokemon_image before update on pokemon_image 
	for each row 
	begin 
	set new.updated_at = current_timestamp; 
	end;; 
delimiter ;