'use strict';

function create_npc(properties){
    properties = properties || {};

    properties['color'] = properties['color'] || '#fff';
    properties['friendly'] = properties['friendly'] || false;
    properties['height'] = properties['height'] || 20;
    properties['width'] = properties['width'] || 20;
    properties['x'] = properties['x'] || 0;
    properties['y'] = properties['y'] || 0;

    properties['stats'] = properties['stats'] || {};
      properties['stats']['health'] = properties['stats']['health'] || {};
        properties['stats']['health']['current'] = properties['stats']['health']['current'] || 1;
        properties['stats']['health']['max'] = properties['stats']['health']['max'] || 1;

    properties['selected'] = properties['selected'] || void 0;
    properties['spellbook'] = properties['spellbook'] || {};

    npcs.push(properties);
}

function create_particle(properties){
    properties = properties || {};

    properties['color'] = properties['color'] || '#fff';
    properties['damage'] = properties['damage'] || 1;
    properties['dx'] = properties['dx'] || 0;
    properties['dy'] = properties['dy'] || 0;
    properties['lifespan'] = properties['lifespan'] || 10;
    properties['owner'] = properties['owner'] == null
      ? -1
      : properties['owner'];
    properties['x'] = properties['x'] || 0;
    properties['y'] = properties['y'] || 0;

    particles.push(properties);
}

function create_player(properties){
    properties = properties || {};

    properties['equipment'] = properties['equipment'] || {
      'feet': void 0,
      'head': void 0,
      'off-hand': void 0,
      'legs': void 0,
      'main-hand': void 0,
      'neck': void 0,
      'torso': void 0,
    };
    properties['inventory'] = properties['inventory'] || [];
    properties['selected'] = properties['selected'] || 0;
    properties['spellbar'] = properties['spellbar'] || {
      0: void 0,
      1: void 0,
      2: void 0,
      3: void 0,
      4: void 0,
      5: void 0,
      6: void 0,
      7: void 0,
      8: void 0,
      9: void 0,
    };
    properties['spellbook'] = properties['spellbook'] || {};
    properties['stats'] = properties['stats'] || {};
    properties['x'] = properties['x'] || 0;
    properties['y'] = properties['y'] || 0;

    player = properties;
}

function create_world_dynamic(properties){
    properties = properties || {};

    properties['collision'] = properties['collision'] == void 0;
    properties['color'] = properties['color'] || '#fff';
    properties['effect'] = properties['effect'] || {};
    properties['effect-stat'] = properties['effect-stat'] || 'health';
    properties['height'] = properties['height'] || 100;
    properties['width'] = properties['width'] || 100;
    properties['x'] = properties['x'] || 0;
    properties['y'] = properties['y'] || 0;

    world_dynamic.push(properties);
}

function draw(){
    buffer.clearRect(
      0,
      0,
      width,
      height
    );

    buffer.save();
    buffer.translate(
      x,
      y
    );

    buffer.save();
    buffer.translate(
      -player['x'],
      -player['y']
    );

    // Draw static world objects.
    for(var object in world_static){
        buffer.fillStyle = world_static[object]['color'];
        buffer.fillRect(
          world_static[object]['x'],
          world_static[object]['y'],
          world_static[object]['width'],
          world_static[object]['height']
        );
    }

    // Draw dynamic world objects.
    for(var object in world_dynamic){
        buffer.fillStyle = world_dynamic[object]['color'];
        buffer.fillRect(
          world_dynamic[object]['x'],
          world_dynamic[object]['y'],
          world_dynamic[object]['width'],
          world_dynamic[object]['height']
        );
    }

    // Draw NPCs.
    for(var npc in npcs){
        buffer.fillStyle = npcs[npc]['color'];
        buffer.fillRect(
          npcs[npc]['x'] - npcs[npc]['width'] / 2,
          npcs[npc]['y'] - npcs[npc]['height'] / 2,
          npcs[npc]['width'],
          npcs[npc]['height']
        );
    }

    // Draw particles.
    for(var particle in particles){
        buffer.fillStyle = particles[particle]['color'];
        buffer.fillRect(
          particles[particle]['x'] - 5,
          particles[particle]['y'] - 5,
          10,
          10
        );
    }

    buffer.restore();

    // Draw player.
    buffer.fillStyle = settings['color'];
    buffer.fillRect(
      -17,
      -17,
      34,
      34
    );

    buffer.restore();

    // Draw UI.
    buffer.fillStyle = '#444';
    buffer.fillRect(
      0,
      0,
      200,
      200
    );

    buffer.fillStyle = '#0a0';
    buffer.fillRect(
      0,
      0,
      200 * (player['stats']['health']['current'] / player['stats']['health']['max']),
      100
    );
    buffer.fillStyle = '#66f';
    buffer.fillRect(
      0,
      100,
      200 * (player['stats']['mana']['current'] / player['stats']['mana']['max']),
      100
    );

    // Setup text display.
    buffer.fillStyle = '#fff';
    buffer.font = '23pt sans-serif';
    buffer.textAlign = 'center';
    buffer.textBaseline = 'middle';

    buffer.fillText(
      player['spellbook'][player['spellbar'][player['selected']]]['current']
        + '/'
        + player['spellbook'][player['spellbar'][player['selected']]]['reload'],
      100,
      225
    );

    buffer.fillText(
      player['stats']['health']['current'],
      50,
      25
    );
    buffer.fillText(
      player['stats']['health']['max'],
      50,
      75
    );
    buffer.fillText(
      player['stats']['mana']['current'],
      50,
      125
    );
    buffer.fillText(
      player['stats']['mana']['max'],
      50,
      175
    );

    buffer.font = '16pt sans-serif';
    buffer.fillText(
      parseInt(player['stats']['health']['current'] * 100 / player['stats']['health']['max'])
        + '%',
      150,
      25
    );
    buffer.fillText(
      player['stats']['health']['regeneration']['current']
        + '/' + player['stats']['health']['regeneration']['max'],
      150,
      75
    );
    buffer.fillText(
      parseInt(player['stats']['mana']['current'] * 100 / player['stats']['mana']['max'])
        + '%',
      150,
      125
    );
    buffer.fillText(
      player['stats']['mana']['regeneration']['current']
        + '/' + player['stats']['mana']['regeneration']['max'],
      150,
      175
    );

    buffer.textAlign = 'left';
    for(var spell in player['spellbar']){
        buffer.fillText(
          spell
            + ': '
            + player['spellbar'][spell]
            + (spell == player['selected']
              ? ', selected'
              : ''
            ),
          0,
          250 + 25 * parseInt(spell)
        );
    }

    // Draw game over messages.
    if(!game_running){
        buffer.font = '23pt sans-serif';
        buffer.textAlign = 'center';
        buffer.fillText(
          'ESC = Main Menu',
          x,
          220
        );

        buffer.fillStyle = '#f00';
        buffer.font = '42pt sans-serif';
        buffer.fillText(
          'YOU ARE DEAD',
          x,
          175
        );
    }

    canvas.clearRect(
      0,
      0,
      width,
      height
    );
    canvas.drawImage(
      document.getElementById('buffer'),
      0,
      0
    );

    animationFrame = window.requestAnimationFrame(draw);
}

function effect_player(stat, effect){
    player['stats'][stat]['current'] -= effect;
    if(player['stats'][stat]['current'] <= 0){
        player['stats'][stat]['current'] = 0;
    }
}

function get_movement_speed(x0, y0, x1, y1){
    var angle = Math.atan(Math.abs(y0 - y1) / Math.abs(x0 - x1));
    return [
      Math.cos(angle),
      Math.sin(angle),
    ];
}

function logic(){
    if(!game_running){
        return;
    }

    if(player['stats']['health']['current'] <= 0){
        game_running = false;
    }

    // Regenerate player health and mana.
    if(player['stats']['health']['current'] < player['stats']['health']['max']){
        player['stats']['health']['regeneration']['current'] += 1;
        if(player['stats']['health']['regeneration']['current'] >= player['stats']['health']['regeneration']['max']){
            player['stats']['health']['current'] += 1;
            player['stats']['health']['regeneration']['current'] = 0;
        }
    }

    if(player['stats']['mana']['current'] < player['stats']['mana']['max']){
        player['stats']['mana']['regeneration']['current'] += 1;
        if(player['stats']['mana']['regeneration']['current'] >= player['stats']['mana']['regeneration']['max']){
            player['stats']['mana']['current'] += 1;
            player['stats']['mana']['regeneration']['current'] = 0;
        }
    }

    var player_dx = 0;
    var player_dy = 0;

    // Add player key movments to dx and dy, if still within level boundaries.
    if(key_left){
        player_dx -= 2;
    }

    if(key_right){
        player_dx += 2;
    }

    if(key_down){
        if(player_dx != 0){
            player_dx = player_dx / 2 * 1.41421;
            player_dy += 1.41421;

        }else{
            player_dy += 2;
        }
    }

    if(key_up){
        if(player_dx != 0){
            player_dx = player_dx / 2 * 1.41421;
            player_dy -= 1.41421;

        }else{
            player_dy -= 2;
        }
    }

    // Check for player collision with dyanmic world objects.
    for(var object in world_dynamic){
        if(world_dynamic[object]['effect'] == 0
          && !world_dynamic[object]['collision']){
            continue;
        }

        if(player['x'] + player_dx - 17 > world_dynamic[object]['x'] + world_dynamic[object]['width']
          || player['x'] + player_dx + 17 < world_dynamic[object]['x']
          || player['y'] + player_dy - 17 > world_dynamic[object]['y'] + world_dynamic[object]['height']
          || player['y'] + player_dy + 17 < world_dynamic[object]['y']){
            continue;
        }

        if(world_dynamic[object]['effect'] > 0){
            effect_player(
              world_dynamic[object]['effect-stat'],
              world_dynamic[object]['effect']
            );
        }

        if(!world_dynamic[object]['collision']){
            continue;
        }

        if(player['y'] != world_dynamic[object]['y'] - 18
          && player['y'] != world_dynamic[object]['y'] + world_dynamic[object]['height'] + 18){
            if(key_left
              && player['y'] + player_dy + 17 > world_dynamic[object]['y']
              && player['y'] + player_dy - 17 < world_dynamic[object]['y'] + world_dynamic[object]['height']
              && player['x'] + player_dx - 17 < world_dynamic[object]['x'] + world_dynamic[object]['width']){
                player_dx = 0;
            }

            if(key_right
              && player['y'] + player_dy + 17 > world_dynamic[object]['y']
              && player['y'] + player_dy - 17 < world_dynamic[object]['y'] + world_dynamic[object]['height']
              && player['x'] + player_dx + 17 > world_dynamic[object]['x']){
                player_dx = 0;
            }
        }

        if(key_down
          && player['x'] + player_dx + 17 > world_dynamic[object]['x']
          && player['x'] + player_dx - 17 < world_dynamic[object]['x'] + world_dynamic[object]['width']
          && player['y'] + player_dy + 17 > world_dynamic[object]['y']){
            player_dy = 0;
        }

        if(key_up
          && player['x'] + player_dx + 17 > world_dynamic[object]['x']
          && player['x'] + player_dx - 17 < world_dynamic[object]['x'] + world_dynamic[object]['width']
          && player['y'] + player_dy - 17 < world_dynamic[object]['y'] + world_dynamic[object]['height']){
            player_dy = 0;
        }
    }

    // Update actual player position.
    player['x'] += player_dx;
    player['y'] += player_dy;

    // Update player spells.
    for(var spell in player['spellbook']){
        if(player['spellbook'][spell]['current'] < player['spellbook'][spell]['reload']){
            player['spellbook'][spell]['current'] += 1;
        }
    }

    // Check if player wants to fire selected spell
    //   and fire it if they do and it can be fired.
    var selected = player['spellbar'][player['selected']];

    if(mouse_lock_x > -1
      && player['spellbook'][selected]['current'] >= player['spellbook'][selected]['reload']
      && player['stats']['mana']['current'] >= player['spellbook'][selected]['cost']){
        player['spellbook'][selected]['current'] = 0;
        player['stats']['mana']['current'] = Math.max(
          player['stats']['mana']['current'] - player['spellbook'][selected]['cost'],
          0
        );

        // Calculate particle movement...
        var speeds = get_movement_speed(
          player['x'],
          player['y'],
          player['x'] + mouse_x - x,
          player['y'] + mouse_y - y
        );

        // ...and add particle with movement pattern, tied to player.
        create_particle({
          'color': player['spellbook'][selected]['color'],
          'damage': player['spellbook'][selected]['damage'],
          'dx': (mouse_x > x ? speeds[0] : -speeds[0]),
          'dy': (mouse_y > y ? speeds[1] : -speeds[1]),
          'lifespan': player['spellbook'][selected]['lifespan'],
          'x': player['x'],
          'y': player['y'],
        });
    }

    // Handle NPCs.
    for(var npc in npcs){
        if(npcs[npc]['selected'] == void 0){
            continue;
        }

        for(var spell in npcs[npc]['spellbook']){
            if(npcs[npc]['spellbook'][spell]['current'] < npcs[npc]['spellbook'][spell]['reload']){
                npcs[npc]['spellbook'][spell]['current'] += 1;
                continue;
            }

            if(npcs[npc]['selected'] !== spell){
                continue;
            }

            npcs[npc]['spellbook'][spell]['current'] = 0;

            // Calculate particle movement...
            var speeds = get_movement_speed(
              npcs[npc]['x'],
              npcs[npc]['y'],
              player['x'],
              player['y']
            );

            // ...and add particle with movement pattern, tied to the NPC.
            create_particle({
              'color': npcs[npc]['spellbook'][spell]['color'],
              'damage': npcs[npc]['spellbook'][spell]['damage'],
              'dx': (player['x'] > npcs[npc]['x'] ? speeds[0] : -speeds[0]),
              'dy': (player['y'] > npcs[npc]['y'] ? speeds[1] : -speeds[1]),
              'lifespan': npcs[npc]['spellbook'][spell]['lifespan'],
              'owner': npc,
              'x': npcs[npc]['x'],
              'y': npcs[npc]['y'],
            });

            break;
        }
    }

    // Handle particles.
    for(var particle in particles){
        particles[particle]['x'] += 5 * particles[particle]['dx'];
        particles[particle]['y'] += 5 * particles[particle]['dy'];

        particles[particle]['lifespan'] -= 1;
        if(particles[particle]['lifespan'] < 0){
            particles.splice(
              particle,
              1
            );
            continue;
        }

        for(var object in world_dynamic){
            if(!world_dynamic[object]['collision']
              || particles[particle]['x'] <= world_dynamic[object]['x']
              || particles[particle]['x'] >= world_dynamic[object]['x'] + world_dynamic[object]['width']
              || particles[particle]['y'] <= world_dynamic[object]['y']
              || particles[particle]['y'] >= world_dynamic[object]['y'] + world_dynamic[object]['height']){
                continue;
            }

            particles.splice(
              particle,
              1
            );
            return;
        }

        // Handle particles not owned by player.
        if(particles[particle]['owner'] > -1){
            if(particles[particle]['x'] > player['x'] - 17
              && particles[particle]['x'] < player['x'] + 17
              && particles[particle]['y'] > player['y'] - 17
              && particles[particle]['y'] < player['y'] + 17){
                effect_player(
                  'health',
                  particles[particle]['damage']
                );

                particles.splice(
                  particle,
                  1
                );
            }

            continue;
        }

        // Handle particles owned by player.
        for(var npc in npcs){
            if(npcs[npc]['friendly']
              || particles[particle]['x'] <= npcs[npc]['x'] - npcs[npc]['width'] / 2
              || particles[particle]['x'] >= npcs[npc]['x'] + npcs[npc]['width'] / 2
              || particles[particle]['y'] <= npcs[npc]['y'] - npcs[npc]['height'] / 2
              || particles[particle]['y'] >= npcs[npc]['y'] + npcs[npc]['height'] / 2){
                continue;
            }

            npcs[npc]['stats']['health']['current'] -= particles[particle]['damage'];
            if(npcs[npc]['stats']['health']['current'] <= 0){
                npcs.splice(
                  npc,
                  1
                );
            }

            particles.splice(
              particle,
              1
            );

            break;
        }
    }
}

function mouse_wheel(e){
    if(mode <= 0){
        return;
    }

    player['selected'] += (e.wheelDelta || -e.detail > 0) > 0
      ? -1
      : 1;

    if(player['selected'] < 0){
        player['selected'] = 9;

    }else if(player['selected'] > 9){
        player['selected'] = 0;
    }
}

function play_audio(id){
    if(settings['audio-volume'] <= 0){
        return;
    }

    document.getElementById(id).currentTime = 0;
    document.getElementById(id).play();
}

function reset(){
    if(!window.confirm('Reset settings?')){
        return;
    }

    document.getElementById('audio-volume').value = 1;
    document.getElementById('color').value = '#009900';
    document.getElementById('movement-keys').value = 'WASD';
    document.getElementById('ms-per-frame').value = 25;

    save();
}

function resize(){
    if(mode <= 0){
        return;
    }

    height = window.innerHeight;
    document.getElementById('buffer').height = height;
    document.getElementById('canvas').height = height;
    y = height / 2;

    width = window.innerWidth;
    document.getElementById('buffer').width = width;
    document.getElementById('canvas').width = width;
    x = width / 2;
}

// Save settings into window.localStorage if they differ from default.
function save(){
    var ids = {
      'audio-volume': 1,
      'ms-per-frame': 25,
    };
    for(var id in ids){
        if(isNaN(document.getElementById(id).value)
          || document.getElementById(id).value == ids[id]){
            window.localStorage.removeItem('RPG-Above.htm-' + id);
            settings[id] = ids[id];

        }else{
            settings[id] = parseFloat(document.getElementById(id).value);
            window.localStorage.setItem(
              'RPG-Above.htm-' + id,
              settings[id]
            );
        }
    }

    ids = {
      'color': '#009900',
      'movement-keys': 'WASD',
    };
    for(id in ids){
        if(document.getElementById(id).value === ids[id]){
            window.localStorage.removeItem('RPG-Above.htm-' + id);
            settings[id] = ids[id];

        }else{
            settings[id] = document.getElementById(id).value;
            window.localStorage.setItem(
              'RPG-Above.htm-' + id,
              settings[id]
            );
        }
    }
}

function setmode(newmode, newgame){
    window.cancelAnimationFrame(animationFrame);
    window.clearInterval(interval);

    npcs.length = 0;
    particles.length = 0;
    world_dynamic.length = 0;
    world_static.length = 0;

    game_running = true;
    mode = newmode;

    // New game mode.
    if(mode > 0){
        // If it's a newgame from the main menu, save and setup canvas and buffers.
        if(newgame){
            save();

            document.getElementById('page').innerHTML =
              '<canvas id=canvas oncontextmenu="return false"></canvas><canvas id=buffer></canvas>';

            buffer = document.getElementById('buffer').getContext('2d');
            canvas = document.getElementById('canvas').getContext('2d');

            resize();
        }

        load_level(0);

        animationFrame = window.requestAnimationFrame(draw);
        interval = window.setInterval(
          'logic()',
          settings['ms-per-frame']
        );

        return;
    }

    // Main menu mode.
    buffer = 0;
    canvas = 0;

    document.getElementById('page').innerHTML = '<div style=display:inline-block;text-align:left;vertical-align:top><div class=c><a onclick="setmode(1, true)">Test Level</a></div></div><div style="border-left:8px solid #222;display:inline-block;text-align:left"><div class=c><input disabled style=border:0 value=Click>Cast Spell<br><input disabled style=border:0 value=ESC>Main Menu<br><input id=movement-keys maxlength=4 value='
      + settings['movement-keys'] + '>Move ↑←↓→<br><input disabled style=border:0 value="0 - 9">Select Spell</div><hr><div class=c><input id=audio-volume max=1 min=0 step=.01 type=range value='
      + settings['audio-volume'] + '>Audio<br><input id=color type=color value='
      + settings['color'] + '>Color<br><input id=ms-per-frame value='
      + settings['ms-per-frame'] + '>ms/Frame<br><a onclick=reset()>Reset Settings</a></div></div>';
}

var animationFrame = 0;
var buffer = 0;
var canvas = 0;
var game_running = false;
var height = 0;
var interval = 0;
var key_down = false;
var key_left = false;
var key_right = false;
var key_up = false;
var mode = 0;
var mouse_lock_x = 0;
var mouse_lock_y = 0;
var mouse_x = 0;
var mouse_y = 0;
var npcs = [];
var particles = [];
var player = {};
var settings = {
  'audio-volume': window.localStorage.getItem('RPG-Above.htm-audio-volume') != null
    ? parseFloat(window.localStorage.getItem('RPG-Above.htm-audio-volume'))
    : 1,
  'color': window.localStorage.getItem('RPG-Above.htm-color') || '#009900',
  'movement-keys': window.localStorage.getItem('RPG-Above.htm-movement-keys') || 'WASD',
  'ms-per-frame': parseInt(window.localStorage.getItem('RPG-Above.htm-ms-per-frame')) || 25,
};
var x = 0;
var width = 0;
var world_dynamic = [];
var world_static = [];
var y = 0;

window.onkeydown = function(e){
    if(mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // ESC: return to main menu.
    if(key === 27){
        setmode(
          0,
          true
        );
        return;

    }else if(key > 47
      && key < 58){
        player['selected'] = key - 48;
        return;
    }

    key = String.fromCharCode(key);

    if(key === settings['movement-keys'][0]){
        key_up = true;

    }else if(key === settings['movement-keys'][1]){
        key_left = true;

    }else if(key === settings['movement-keys'][2]){
        key_down = true;

    }else if(key === settings['movement-keys'][3]){
        key_right = true;
    }
};

window.onkeyup = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === settings['movement-keys'][0]){
        key_up = false;

    }else if(key === settings['movement-keys'][1]){
        key_left = false;

    }else if(key === settings['movement-keys'][2]){
        key_down = false;

    }else if(key === settings['movement-keys'][3]){
        key_right = false;
    }
};

window.onload = function(e){
    if('onmousewheel' in window){
        window.onmousewheel = mouse_wheel;

    }else{
        document.addEventListener(
          'DOMMouseScroll',
          mouse_wheel,
          false
        );
    }

    setmode(
      0,
      true
    );
};

window.onmousedown = function(e){
    if(mode <= 0){
        return;
    }

    e.preventDefault();
    mouse_lock_x = mouse_x;
    mouse_lock_y = mouse_y;
};

window.onmousemove = function(e){
    if(mode <= 0){
        return;
    }

    mouse_x = e.pageX;
    mouse_y = e.pageY;
};

window.onmouseup = function(e){
    mouse_lock_x = -1;
};

window.onresize = resize;
