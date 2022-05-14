"use strict";
(async () => {
    const appendStatTicker = function appendStatTicker(stats) {
        appendSection(null, '.info__stats', stats.map(({ base_stat, stat: { name } }) => {
            const stat = document.createElement('div');
            stat.classList.add('stat');
            const statValue = document.createElement('p');
            statValue.classList.add('stat__value');
            statValue.textContent = base_stat.toString();
            stat.append(statValue);
            const statName = document.createElement('p');
            statName.classList.add('stat__name');
            statName.textContent = name;
            stat.append(statName);
            return stat;
        }));
    };

    const appendSection = function appendSection(title, selector, children) {
        const containerRef = document.querySelector(selector);
        if (title && title.length > 0) {
            const titleRef = document.createElement('h3');
            titleRef.textContent = title;
            containerRef.append(titleRef);
        }
        children.forEach(child => containerRef.append(child));
    };

    const { fetchPokemonByName, query } = window.pokedex;
    const pokemonId = (new URL(window.location.href)).searchParams.get('id');
    const [pokemon] = await fetchPokemonByName(pokemonId);

    const portraitImgRef = document.querySelector('.portrait__img');
    portraitImgRef.src = pokemon.sprites.other["official-artwork"].front_default;
    portraitImgRef.crossOrigin = 'cross-origin';
    appendStatTicker(pokemon.stats);

    // Pokemon Name
    const nameRef = document.querySelector('.pokemon__name');
    nameRef.textContent = pokemon.name.toUpperCase() + '#' + pokemon.id;
    
    const abilities = await Promise.all(pokemon.abilities.map(({ ability }) => query(ability.url)));
    const elements = await Promise.all(pokemon.types.map(({ type }) => query(type.url)));
    const strengths = await Promise.all(elements
        .flatMap(({ damage_relations }) => damage_relations.double_damage_to)
        .map(({ url }) => query(url)));
    const weaknesses = await Promise.all(elements
        .flatMap(({ damage_relations }) => damage_relations.double_damage_from)
        .map(({ url }) => query(url)));

    // Ability Section
    appendSection('Abilities', '.info__abilities', abilities.map(ability => {
        const abilityRef = document.createElement('div');
        abilityRef.classList.add('ability');
        const abilityNameRef = document.createElement('p');
        abilityNameRef.classList.add('ability__title');
        abilityNameRef.textContent = ability.name;
        abilityRef.append(abilityNameRef);
        return abilityRef;
    }));

    // Elemental Type Section
    appendSection('Elements', '.info__elements', elements.map(({ name }) => {
        const elementRef = document.createElement('div');
        elementRef.classList.add('element');
        const elementNameRef = document.createElement('p');
        elementNameRef.classList.add('element__title');
        elementNameRef.textContent = name;
        elementRef.append(elementNameRef);
        return elementRef;
    }));

    // Strong Vs Section
    appendSection('Strong Against', '.info__strength', strengths.map(({ name }) => {
        const elementRef = document.createElement('div');
        elementRef.classList.add('element');
        const elementNameRef = document.createElement('p');
        elementNameRef.classList.add('element__title');
        elementNameRef.textContent = name;
        elementRef.append(elementNameRef);
        return elementRef;
    }));

    // Weak Vs Section
    appendSection('Weak Against', '.info__weakness', weaknesses.map(({ name }) => {
        const elementRef = document.createElement('div');
        elementRef.classList.add('element');
        const elementNameRef = document.createElement('p');
        elementNameRef.classList.add('element__title');
        elementNameRef.textContent = name;
        elementRef.append(elementNameRef);
        return elementRef;
    }));

    // Record User Visit
    fetch('/api/v2/timeline/capture', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'view-profile',
            data: {
                profileId: pokemon.id,
            },
        }),
    });
})();
