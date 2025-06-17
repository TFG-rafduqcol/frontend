document.addEventListener("DOMContentLoaded", () => {
    const translations = {
        es: {
            book_title: "Libro Tower Defense Azteka",
            home: "Inicio",
            how_to_play: "Cómo Jugar",
            how_to_play_main: "Construye, mejora y coloca torres estratégicamente para detener oleadas de invasores. Gestiona tu oro con sabiduría y adapta tu defensa a cada tipo de enemigo para proteger el templo azteca.",
            difficulty_modes_title: "Modos de dificultad:",
            normal_mode_desc: "Un modo más rápido gracias a un algoritmo eficiente, aunque menos preciso en los cálculos de trayectoria y colisiones.",
            hard_mode_desc: "Un desafío avanzado con un algoritmo más preciso y exigente, donde cada error cuenta.",
            ranks_achievements_title: "Rangos y logros:",
            gold_rank_desc: "Para obtener el rango Gold, debes llegar a la ronda 50 en Normal Mode.",
            master_rank_desc: "Para alcanzar el rango Master, deberás superar la ronda 50 en ambos modos: Normal Mode y Hard Mode.",
            enemies: "Enemigos",
            towers: "Torres",
            upgrades_title: "Mejoras de Torres",
            // Torres
            tower_arrows: "Torre de Flechas",
            tower_arrows_desc_main: "Torre básica de largo alcance y disparo rápido. Perfecta para eliminar enemigos veloces y débiles en las primeras rondas.",
            tower_arrows_upgrade: "Mejora: +1 daño, +10 rango, +0.1 velocidad de disparo. Coste: 100.",
            tower_iron: "Torre de Cargas",
            tower_iron_desc_main: "Lanza pesadas piedras de hierro que causan daño. Ideal para romper defensas resistentes.",
            tower_iron_upgrade: "Mejora: +2 daño, +10 rango, +0.1 velocidad de disparo. Coste: 125.",
            tower_fire: "Torre de Fuego",
            tower_fire_desc_main: "Lanza proyectiles ígneos que queman a los enemigos, causando mucho daño. Muy efectiva contra enemigos con alta defensa.",
            tower_fire_upgrade: "Mejora: +2 daño, +10 rango, +0.1 velocidad de disparo. Coste: 150.",
            tower_rock: "Mortero de Roca",
            tower_rock_desc_main: "Dispara rocas masivas que explotan al impactar, causando gran daño. Es la mejor opción para eliminar enemigos muy resistentes.",
            tower_rock_upgrade: "Mejora: +3 daño, +10 rango, +0.1 velocidad de disparo. Coste: 120.",
            fires_every: "Dispara cada:",
            damage_per_hit: "Daño por impacto:",
            price: "Precio:",
            range: "Rango:",
            // Enemigos
            enemy_daggerkin: "Daggerkin",
            enemy_daggerkin_desc: "Un explorador ágil y escurridizo. Su baja salud se compensa con una velocidad vertiginosa, ideal para poner a prueba tus reflejos defensivos.<br>Salud: 40.<br>Velocidad: Muy rápida.",
            enemy_orcutter: "Orcutter",
            enemy_orcutter_desc: "Un guerrero robusto y testarudo. Aunque lento, su resistencia le permite avanzar bajo el fuego enemigo sin vacilar.<br>Salud: 60.<br>Velocidad: Lenta.",
            enemy_oculom: "Oculom",
            enemy_oculom_desc: "Un ojo volador que surca los cielos. Es inmune a los ataques del mortero y desafía tus defensas desde el aire.<br>Salud: 40.<br>Velocidad: Rápida.",
            enemy_devilorc: "Devil Orc",
            enemy_devilorc_desc: "Un orco infernal, lento pero temible. Resiste la piedra y el hierro, pero teme el fuego que puede consumirlo.<br>Salud: 90.<br>Velocidad: Muy lenta.",
            enemy_grayskull: "Gray Skull",
            enemy_grayskull_desc: "Un coloso de hueso y magia oscura. Su enorme vitalidad solo es superada por su debilidad ante el mortero de roca.<br>Salud: 140.<br>Velocidad: Muy lenta.",
            enemy_carriontropper: "Carrion Tropper",
            enemy_carriontropper_desc: "Un guerrero putrefacto, resistente a casi todo salvo al fuego. Su avance lento es una amenaza constante.<br>Salud: 90.<br>Velocidad: Lenta.",
            enemy_hellbat: "Hell Bat",
            enemy_hellbat_desc: "Murciélago infernal que ataca desde el aire. Solo el mortero de roca puede derribarlo antes de que cause estragos.<br>Salud: 80.<br>Velocidad: Media.",
            enemy_hexlord: "Hex Lord",
            enemy_hexlord_desc: "Un hechicero oscuro que sana a sus aliados. Su presencia prolonga la batalla y pone a prueba tu estrategia.<br>Salud: 90.<br>Velocidad: Media.",
            enemy_darkseer: "Dark Seer",
            enemy_darkseer_desc: "El azote de los aztecas: resistente a piedra, hierro, fuego y roca. Su avance lento es imparable si no usas todo tu ingenio.<br>Salud: 140.<br>Velocidad: Muy lenta."
        },
        en: {
            book_title: "Tower Defense Azteka Book",
            home: "Home",
            how_to_play: "How to Play",
            how_to_play_main: "Build, upgrade, and strategically place towers to stop waves of invaders. Manage your gold wisely and adapt your defense to each type of enemy to protect the Aztec temple.",
            difficulty_modes_title: "Difficulty modes:",
            normal_mode_desc: "A faster mode thanks to an efficient algorithm, although less precise in trajectory and collision calculations.",
            hard_mode_desc: "An advanced challenge with a more accurate and demanding algorithm, where every mistake counts.",
            ranks_achievements_title: "Ranks and achievements:",
            gold_rank_desc: "To obtain the Gold rank, you must reach round 50 in Normal Mode.",
            master_rank_desc: "To achieve the Master rank, you must surpass round 50 in both modes: Normal Mode and Hard Mode.",
            enemies: "Enemies",
            towers: "Towers",
            upgrades_title: "Tower Upgrades",
            // Towers
            tower_arrows: "Arrow Tower",
            tower_arrows_desc_main: "Basic tower with long range and fast shooting. Perfect for eliminating fast and weak enemies in early rounds.",
            tower_arrows_upgrade: "Upgrade: +1 damage, +10 range, +0.1 fire rate. Cost: 100.",
            tower_iron: "Iron Tower",
            tower_iron_desc_main: "Throws heavy iron stones that deal damage. Ideal for breaking tough defenses.",
            tower_iron_upgrade: "Upgrade: +2 damage, +10 range, +0.1 fire rate. Cost: 125.",
            tower_fire: "Fire Tower",
            tower_fire_desc_main: "Launches fiery projectiles that burn enemies, causing high damage. Very effective against high-defense enemies.",
            tower_fire_upgrade: "Upgrade: +2 damage, +10 range, +0.1 fire rate. Cost: 150.",
            tower_rock: "Rock Mortar",
            tower_rock_desc_main: "Fires massive rocks that explode on impact, causing great damage. The best option for eliminating very tough enemies.",
            tower_rock_upgrade: "Upgrade: +3 damage, +10 range, +0.1 fire rate. Cost: 120.",
            fires_every: "Fires every:",
            damage_per_hit: "Damage per hit:",
            price: "Price:",
            range: "Range:",
            // Enemies
            enemy_daggerkin: "Daggerkin",
            enemy_daggerkin_desc: "An agile and elusive scout. Its low health is offset by lightning speed, perfect for testing your defensive reflexes.<br>Health: 40.<br>Speed: Very fast.",
            enemy_orcutter: "Orcutter",
            enemy_orcutter_desc: "A sturdy, stubborn warrior. Slow but tough, it advances under enemy fire without hesitation.<br>Health: 60.<br>Speed: Slow.",
            enemy_oculom: "Oculom",
            enemy_oculom_desc: "A flying eye that soars through the skies. Immune to mortar attacks and challenges your defenses from above.<br>Health: 40.<br>Speed: Fast.",
            enemy_devilorc: "Devil Orc",
            enemy_devilorc_desc: "An infernal orc, slow but fearsome. Resistant to stone and iron, but fears fire that can consume it.<br>Health: 90.<br>Speed: Very slow.",
            enemy_grayskull: "Gray Skull",
            enemy_grayskull_desc: "A colossus of bone and dark magic. Its huge vitality is only surpassed by its weakness to the rock mortar.<br>Health: 140.<br>Speed: Very slow.",
            enemy_carriontropper: "Carrion Tropper",
            enemy_carriontropper_desc: "A putrid warrior, resistant to almost everything except fire. Its slow advance is a constant threat.<br>Health: 90.<br>Speed: Slow.",
            enemy_hellbat: "Hell Bat",
            enemy_hellbat_desc: "Infernal bat that attacks from the air. Only the rock mortar can bring it down before it wreaks havoc.<br>Health: 80.<br>Speed: Medium.",
            enemy_hexlord: "Hex Lord",
            enemy_hexlord_desc: "A dark sorcerer who heals his allies. His presence prolongs the battle and tests your strategy.<br>Health: 90.<br>Speed: Medium.",
            enemy_darkseer: "Dark Seer",
            enemy_darkseer_desc: "The scourge of the Aztecs: resistant to stone, iron, fire, and rock. Its slow advance is unstoppable unless you use all your wits.<br>Health: 140.<br>Speed: Very slow."
        }
    };

    function getLang() {
        return (localStorage.getItem('language') || 'es');
    }

    function t(key, fallback) {
        const lang = getLang();
        if (translations[lang] && translations[lang][key]) {
            return translations[lang][key];
        }
        if (translations['es'][key]) return translations['es'][key];
        return fallback || key;
    }

    function applyBookTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = t(key, el.textContent);
        });
        
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            el.title = t(key, el.title);
        });

        document.title = t('book_title', document.title);
        
        const howToPlayIds = [
            'how_to_play_main',
            'normal_mode_desc',
            'hard_mode_desc',
            'gold_rank_desc',
            'master_rank_desc'
        ];
        
        howToPlayIds.forEach(key => {
            const el = document.getElementById(key);
            if (el) el.innerHTML = t(key, el.innerHTML);
        });
        
        const enemyDescIds = [
            'enemy_daggerkin_desc',
            'enemy_orcutter_desc',
            'enemy_oculom_desc',
            'enemy_devilorc_desc',
            'enemy_grayskull_desc',
            'enemy_carriontropper_desc',
            'enemy_hellbat_desc',
            'enemy_hexlord_desc',
            'enemy_darkseer_desc'
        ];
        
        enemyDescIds.forEach(key => {
            const el = document.getElementById(key);
            if (el) el.innerHTML = t(key, el.innerHTML);
        });
        
        const towerMainDescIds = [
            'tower_arrows_desc_main',
            'tower_iron_desc_main',
            'tower_fire_desc_main',
            'tower_rock_desc_main'
        ];
        towerMainDescIds.forEach(key => {
            const el = document.querySelector(`[data-i18n="${key}"]`);
            if (el) el.innerHTML = t(key, el.innerHTML);
            const upgradeKey = key.replace('_desc_main', '_upgrade');
            if (el && translations[getLang()][upgradeKey]) {
                let upgradeEl = el.parentNode.querySelector('.tower-upgrade-container');
                if (!upgradeEl) {
                    upgradeEl = document.createElement('div');
                    upgradeEl.className = 'tower-upgrade-container';
                    el.parentNode.appendChild(upgradeEl);
                }
                upgradeEl.innerHTML = `<div class="tower-upgrade tower-stat"><strong>${t(upgradeKey)}</strong></div>`;
            }
        });
        
        const towerStatsIds = [
            'tower_arrows_rate', 'tower_arrows_damage', 'tower_arrows_price', 'tower_arrows_range',
            'tower_iron_rate', 'tower_iron_damage', 'tower_iron_price', 'tower_iron_range',
            'tower_fire_rate', 'tower_fire_damage', 'tower_fire_price', 'tower_fire_range',
            'tower_rock_rate', 'tower_rock_damage', 'tower_rock_price', 'tower_rock_range'
        ];
        
        towerStatsIds.forEach(key => {
            const el = document.getElementById(key);
            if (el) el.innerHTML = t(key, el.innerHTML);
        });
    }

    applyBookTranslations();
    
  
    
    window.addEventListener('languageChanged', applyBookTranslations);
});