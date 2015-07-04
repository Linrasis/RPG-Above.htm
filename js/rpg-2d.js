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
          world_dynamic[object]['x'] - world_dynamic[object]['width'] / 2,
          world_dynamic[object]['y'] - world_dynamic[object]['height'] / 2,
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
          particles[particle]['x'],
          particles[particle]['y'],
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
      player['spellbook'][player['selected']]['current']
        + '/'
        + player['spellbook'][player['selected']]['reload'],
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

    // Draw game over messages.
    if(!game_running){
        buffer.fillText(
          'ESC = Main Menu',
          5,
          175
        );

        buffer.fillText(
          'YOU ARE DEAD',
          5,
          200
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

function logic(){
    if(!game_running){
        return;
    }

    // Regenerate player health and mana.
    if(player['stats']['health']['current'] < player['stats']['health']['max']){
        player['stats']['health']['regeneration']['current'] += 1;
        if(player['stats']['health']['regen']['current'] >= player['stats']['health']['regeneration']['max']){
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

    // Add player key movments to dx and dy, if still within level boundaries.
    if(key_left){
        player['x'] -= 2;
    }

    if(key_right){
        player['x'] += 2;
    }

    if(key_down){
        player['y'] += 2;
    }

    if(key_up){
        player['y'] -= 2;
    }

    if(player['spellbook'][player['selected']]['current'] >= player['spellbook'][player['selected']]['reload']){
       if(mouse_lock_x > -1
          && player['stats']['mana']['current'] >= player['spellbook'][player['selected']]['cost']){
            player['spellbook'][player['selected']]['current'] = 0;
            player['stats']['mana']['current'] = Math.max(
              player['stats']['mana']['current'] - player['spellbook'][player['selected']]['cost'],
              0
            );

            // Calculate particle movement...
            var j = m(
              player['x'],
              player['y'],
              player['x'] + mouse_x - x,
              player['y'] + mouse_y - y
            );

            // ...and add particle with movement pattern, tied to player.
            particles.push({
              'color': '#f00',
              'dx': (mouse_x > x ? j[0] : -j[0]),
              'dy': (mouse_y > y ? j[1] : -j[1]),
              'lifespan': 100,
              'owner': 0,
              'x': player['x'],
              'y': player['y'],
            });
        }

    }else{
        player['spellbook'][player['selected']]['current'] += 1;
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
              || particles[particle]['x'] <= world_dynamic[object]['x'] - world_dynamic[object]['width'] / 2
              || particles[particle]['x'] >= world_dynamic[object]['x'] + world_dynamic[object]['width'] / 2
              || particles[particle]['y'] <= world_dynamic[object]['y'] - world_dynamic[object]['height'] / 2
              || particles[particle]['y'] >= world_dynamic[object]['y'] + world_dynamic[object]['height'] / 2){
                continue;
            }

            particles.splice(
              particle,
              1
            );
            break;
        }
    }
}

function m(x0,y0,x1,y1){
    var j0 = Math.abs(x0 - x1);
    var j1 = Math.abs(y0 - y1);

    if(j0 > j1){
        return [1, j1 / j0];

    }else if(j1 > j0){
        return [j0 / j1, 1];

    }else{
        return [.5, .5];
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
            window.localStorage.removeItem('RPG-2D.htm-' + id);
            settings[id] = ids[id];

        }else{
            settings[id] = parseFloat(document.getElementById(id).value);
            window.localStorage.setItem(
              'RPG-2D.htm-' + id,
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
            window.localStorage.removeItem('RPG-2D.htm-' + id);
            settings[id] = ids[id];

        }else{
            settings[id] = document.getElementById(id).value;
            window.localStorage.setItem(
              'RPG-2D.htm-' + id,
              settings[id]
            );
        }
    }
}

function setmode(newmode, newgame){
    window.cancelAnimationFrame(animationFrame);
    window.clearInterval(interval);

    particles.length = 0;

    game_running = true;
    mode = newmode;

    // New game mode.
    if(mode > 0){
        // If it's a newgame from the main menu, save settings.
        if(newgame){
            save();
        }

        player = {
          'equipment': {
            'feet': undefined,
            'head': undefined,
            'off-hand': undefined,
            'legs': undefined,
            'main-hand': undefined,
            'neck': undefined,
            'torso': undefined,
          },
          'inventory': [],
          'selected': 'bolt',
          'spellbook': {
            'bolt': {
              'cost': 1,
              'current': 10,
              'reload': 10,
            },
          },
          'stats': {
            'health': {
              'current': 100,
              'max': 100,
              'regeneration': {
                'current': 0,
                'max': 100,
              },
            },
            'mana': {
              'current': 10,
              'max': 10,
              'regeneration': {
                'current': 0,
                'max': 100,
              },
            },
          },
          'x': 0,
          'y': 0,
        };

        // Reset keypresses.
        key_left = false;
        key_right = false;

        // If it's a newgame from the main menu, setup canvas and buffers.
        if(newgame){
            document.getElementById('page').innerHTML = '<canvas id=canvas></canvas><canvas id=buffer style=display:none></canvas>';

            buffer = document.getElementById('buffer').getContext('2d');
            canvas = document.getElementById('canvas').getContext('2d');

            resize();
        }

        world_dynamic.push({
          'collision': true,
          'color': '#222',
          'height': 100,
          'width': 25,
          'x': -150,
          'y': -150,
        });
        world_static.push({
          'color': '#333',
          'height': 500,
          'width': 500,
          'x': -250,
          'y': -250,
        });

        npcs.push({
          'color': '#fff',
          'friendly': true,
          'height': 20,
          'width': 20,
          'x': -200,
          'y': 100,
        },{
          'color': '#fff',
          'friendly': false,
          'height': 20,
          'width': 20,
          'x': 200,
          'y': -100,
        });

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
      + settings['movement-keys'] + '>Move ↑←↓→</div><hr><div class=c><input id=audio-volume max=1 min=0 step=.01 type=range value='
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
  'audio-volume': window.localStorage.getItem('RPG-2D.htm-audio-volume') != null
    ? parseFloat(window.localStorage.getItem('RPG-2D.htm-audio-volume'))
    : 1,
  'color': window.localStorage.getItem('RPG-2D.htm-color') || '#009900',
  'movement-keys': window.localStorage.getItem('RPG-2D.htm-movement-keys') || 'WASD',
  'ms-per-frame': parseInt(window.localStorage.getItem('RPG-2D.htm-ms-per-frame')) || 25,
  'restart-key': window.localStorage.getItem('RPG-2D.htm-restart-key') || 'H',
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

    }else if(key === settings['restart-key']){
        update_best();
        setmode(
          mode,
          false
        );
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
