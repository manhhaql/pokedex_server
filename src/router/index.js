import Express from 'express';
import Cors from 'cors';
import Morgan from 'morgan';
import BodyParser from 'body-parser';
import Path from 'path';

import HelloRoute from './hello_route';
import AuthenticationRoute from './authenticationRoute';
import PokemonRoute from './pokemonRoute';
import PropertiesRoute from './propertiesRoute';
import PokemonPropertiesRoute from './pokemonPropertiesRoute';
import PokemonTypeRoute from './pokemonTypeRoute';
import PokemonWeaknessRoute from './pokemonWeaknessRoute';
import PokemonAbilityRoute from './pokemonAbilityRoute';

import PokemonImageRoute from './pokemonImageRoute';
import UserRoute from './userRoute';


class AppRoute {
    constructor() {
        this.helloRoute = new HelloRoute();
        this.authenticationRoute = new AuthenticationRoute(); 
        this.pokemonRoute = new PokemonRoute(); 
        this.propertiesRoute = new PropertiesRoute(); 
        this.pokemonPropertiesRoute = new PokemonPropertiesRoute(); 
        this.pokemonTypeRoute = new PokemonTypeRoute();
        this.pokemonWeaknessRoute = new PokemonWeaknessRoute();
        this.pokemonAbilityRoute = new PokemonAbilityRoute();
        this.pokemonImageRoute = new PokemonImageRoute(); 
        this.userRoute = new UserRoute(); 

        this.express = Express();
        this.middleware();
        this.routes();
    };

    middleware() {
        this.express.use(Cors());
        this.express.use(Morgan('dev'));
        this.express.use(BodyParser.json());
        this.express.use(BodyParser.urlencoded({
            extended: true
        }));
    };

    routes() {
        this.express.use('/api-docs', Express.static(Path.join(__dirname, '../../', '/swagger')));
        this.express.use('/hello', this.helloRoute.router);
        this.express.use('/authentication', this.authenticationRoute.router);
        this.express.use('/pokemon', this.pokemonRoute.router);
        this.express.use('/properties', this.propertiesRoute.router);
        this.express.use('/product-properties', this.pokemonPropertiesRoute.router);
        this.express.use('/pokemon-type', this.pokemonTypeRoute.router);
        this.express.use('/pokemon-weakness', this.pokemonWeaknessRoute.router);
        this.express.use('/pokemon-ability', this.pokemonAbilityRoute.router);
        this.express.use('/pokemon-image', this.pokemonImageRoute.router);
        this.express.use('/users', this.userRoute.router);
    };
};

export default AppRoute;