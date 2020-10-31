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
	type tinyint default 0,
    status tinyint default 0,
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
insert into users (username, password, salt,type, status) values ('admin', '37dbfe84d5a1eb2648f7bb6e9f8b9397f7e2b942ff855e5a479a7cfccaff13c7', 'c9a36cd264578f5c8e44', 0, 0)

-- AUTHENTICATION_SESSION
drop table if exists authentication_session;
create table if not exists authentication_session (
	id int auto_increment,
    user_id int not null,
    token varchar(255) not null,
    status tinyint default 0,
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
	status tinyint not null default 0,
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