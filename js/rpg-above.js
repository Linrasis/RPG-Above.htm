'use strict';

function draw_logic(){
    buffer.save();
    buffer.translate(
      x,
      y
    );

    buffer.save();
    buffer.translate(
      -rpg_player['x'],
      -rpg_player['y']
    );

    // Draw static world objects.
    for(var object in rpg_world_static){
        buffer.fillStyle = rpg_world_static[object]['color'];
        buffer.fillRect(
          rpg_world_static[object]['x'],
          rpg_world_static[object]['y'],
          rpg_world_static[object]['width'],
          rpg_world_static[object]['height']
        );
    }

    // Draw dynamic world objects.
    for(var object in rpg_world_dynamic){
        buffer.fillStyle = rpg_world_dynamic[object]['color'];
        buffer.fillRect(
          rpg_world_dynamic[object]['x'],
          rpg_world_dynamic[object]['y'],
          rpg_world_dynamic[object]['width'],
          rpg_world_dynamic[object]['height']
        );
    }

    // Draw NPCs.
    for(var npc in rpg_npcs){
        buffer.fillStyle = rpg_npcs[npc]['color'];
        buffer.fillRect(
          rpg_npcs[npc]['x'] - rpg_npcs[npc]['width-half'],
          rpg_npcs[npc]['y'] - rpg_npcs[npc]['height-half'],
          rpg_npcs[npc]['width'],
          rpg_npcs[npc]['height']
        );
    }

    // Draw particles.
    for(var particle in rpg_particles){
        buffer.fillStyle = rpg_particles[particle]['color'];
        buffer.fillRect(
          rpg_particles[particle]['x'] - rpg_particles[particle]['width-half'],
          rpg_particles[particle]['y'] - rpg_particles[particle]['height-half'],
          rpg_particles[particle]['width'],
          rpg_particles[particle]['height']
        );
    }

    buffer.restore();

    // Draw player and targeting direction.
    buffer.fillStyle = settings['color'];
    buffer.fillRect(
      -rpg_player['width-half'],
      -rpg_player['height-half'],
      rpg_player['width'],
      rpg_player['height']
    );
    var endpoint = fixed_length_line(
      0,
      0,
      mouse_x - x,
      mouse_y - y,
      25
    );
    buffer.beginPath();
    buffer.moveTo(
      0,
      0
    );
    buffer.lineTo(
      endpoint['x'],
      endpoint['y']
    );
    buffer.closePath();
    buffer.strokeStyle = '#fff';
    buffer.stroke();

    buffer.restore();

    // Draw UI.
    buffer.fillStyle = '#444';
    buffer.fillRect(
      0,
      0,
      200,
      250
    );

    buffer.fillStyle = '#0a0';
    buffer.fillRect(
      0,
      0,
      200 * (rpg_player['stats']['health']['current'] / rpg_player['stats']['health']['max']),
      100
    );
    buffer.fillStyle = '#66f';
    buffer.fillRect(
      0,
      100,
      200 * (rpg_player['stats']['mana']['current'] / rpg_player['stats']['mana']['max']),
      100
    );

    // Setup text display.
    buffer.fillStyle = '#fff';
    buffer.font = fonts['medium'];
    buffer.textAlign = 'center';
    buffer.textBaseline = 'middle';

    buffer.fillText(
      rpg_player['stats']['health']['current'],
      50,
      25
    );
    buffer.fillText(
      rpg_player['stats']['health']['max'],
      50,
      75
    );
    buffer.fillText(
      rpg_player['stats']['mana']['current'],
      50,
      125
    );
    buffer.fillText(
      rpg_player['stats']['mana']['max'],
      50,
      175
    );
    buffer.fillText(
      parseInt(
        rpg_player['stats']['health']['current'] * 100 / rpg_player['stats']['health']['max'],
        10
      ) + '%',
      150,
      25
    );
    buffer.fillText(
      rpg_player['stats']['health']['regeneration']['current']
        + '/' + rpg_player['stats']['health']['regeneration']['max'],
      150,
      75
    );
    buffer.fillText(
      parseInt(
        rpg_player['stats']['mana']['current'] * 100 / rpg_player['stats']['mana']['max'],
        10
      ) + '%',
      150,
      125
    );
    buffer.fillText(
      rpg_player['stats']['mana']['regeneration']['current']
        + '/' + rpg_player['stats']['mana']['regeneration']['max'],
      150,
      175
    );

    // Draw selected UI.
    buffer.textAlign = 'left';
    if(rpg_ui === 1){
        buffer.fillText(
          'CHARACTER',
          205,
          13
        );

    }else if(rpg_ui === 2){
        buffer.fillText(
          'Inventory is empty.',
          205,
          13
        );

    }else if(rpg_ui === 3){
        for(var spell in rpg_player['spellbar']){
            buffer.fillText(
              spell
                + ': '
                + rpg_player['spellbar'][spell]
                + (spell == rpg_player['selected']
                  ? ', selected'
                  : ''
                ),
              205,
              25 * parseInt(
                spell,
                10
              ) - 12
            );
        }
    }

    // Draw game over messages.
    if(!game_running){
        buffer.textAlign = 'center';
        buffer.fillText(
          'ESC = Main Menu',
          x,
          220
        );

        buffer.fillStyle = '#f00';
        buffer.font = fonts['big'];
        buffer.fillText(
          'YOU ARE DEAD',
          x,
          175
        );
    }
}

function logic(){
    if(!game_running){
        return;
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
            player_dx = player_dx / 2 * Math.SQRT2;
            player_dy += Math.SQRT2;

        }else{
            player_dy += 2;
        }
    }

    if(key_up){
        if(player_dx != 0){
            player_dx = player_dx / 2 * Math.SQRT2;
            player_dy -= Math.SQRT2;

        }else{
            player_dy -= 2;
        }
    }

    // Check for player collision with dynamic world objects.
    for(var object in rpg_world_dynamic){
        if(rpg_world_dynamic[object]['effect'] === 0
          && !rpg_world_dynamic[object]['collision']){
            continue;
        }

        if(rpg_player['x'] + player_dx - rpg_player['width-half'] > rpg_world_dynamic[object]['x'] + rpg_world_dynamic[object]['width']
          || rpg_player['x'] + player_dx + rpg_player['width-half'] < rpg_world_dynamic[object]['x']
          || rpg_player['y'] + player_dy - rpg_player['height-half'] > rpg_world_dynamic[object]['y'] + rpg_world_dynamic[object]['height']
          || rpg_player['y'] + player_dy + rpg_player['height-half'] < rpg_world_dynamic[object]['y']){
            continue;
        }

        if(rpg_world_dynamic[object]['effect'] > 0){
            rpg_player_affect(
              rpg_world_dynamic[object]['effect-stat'],
              rpg_world_dynamic[object]['effect']
            );
        }

        if(!rpg_world_dynamic[object]['collision']){
            continue;
        }

        if(rpg_player['y'] > rpg_world_dynamic[object]['y'] - rpg_player['height-half']
          && rpg_player['y'] < rpg_world_dynamic[object]['y'] + rpg_world_dynamic[object]['height'] + rpg_player['height-half']){
            if(key_left
              && rpg_player['y'] + player_dy + rpg_player['height-half'] > rpg_world_dynamic[object]['y']
              && rpg_player['y'] + player_dy - rpg_player['height-half'] < rpg_world_dynamic[object]['y'] + rpg_world_dynamic[object]['height']
              && rpg_player['x'] + player_dx - rpg_player['width-half'] < rpg_world_dynamic[object]['x'] + rpg_world_dynamic[object]['width']){
                player_dx = 0;

            }else if(key_right
              && rpg_player['y'] + player_dy + rpg_player['height-half'] > rpg_world_dynamic[object]['y']
              && rpg_player['y'] + player_dy - rpg_player['height-half'] < rpg_world_dynamic[object]['y'] + rpg_world_dynamic[object]['height']
              && rpg_player['x'] + player_dx + rpg_player['width-half'] > rpg_world_dynamic[object]['x']){
                player_dx = 0;
            }
        }

        if(key_down
          && rpg_player['x'] + player_dx + rpg_player['width-half'] > rpg_world_dynamic[object]['x']
          && rpg_player['x'] + player_dx - rpg_player['width-half'] < rpg_world_dynamic[object]['x'] + rpg_world_dynamic[object]['width']
          && rpg_player['y'] + player_dy + rpg_player['height-half'] > rpg_world_dynamic[object]['y']){
            player_dy = 0;

        }else if(key_up
          && rpg_player['x'] + player_dx + rpg_player['width-half'] > rpg_world_dynamic[object]['x']
          && rpg_player['x'] + player_dx - rpg_player['width-half'] < rpg_world_dynamic[object]['x'] + rpg_world_dynamic[object]['width']
          && rpg_player['y'] + player_dy - rpg_player['height-half'] < rpg_world_dynamic[object]['y'] + rpg_world_dynamic[object]['height']){
            player_dy = 0;
        }
    }

    // Update actual player position.
    rpg_player['x'] += player_dx;
    rpg_player['y'] += player_dy;

    rpg_player_handle();
    rpg_npc_handle();
    rpg_particle_handle();
}

function mouse_wheel(e){
    if(mode <= 0){
        return;
    }

    rpg_spell_select(
      rpg_player['selected']
        + (
          (e.wheelDelta || -e.detail) > 0
            ? -1
            : 1
        )
    );
}

function setmode_logic(newgame){
    game_running = true;
    rpg_npcs.length = 0;
    rpg_particles.length = 0;
    rpg_world_dynamic.length = 0;
    rpg_world_static.length = 0;

    // Main menu mode.
    if(mode === 0){
        document.body.innerHTML = '<div><div><a onclick="setmode(1, true)">Test Level</a></div></div>'
          + '<div class=right><div><input disabled value=Click>Cast Spell<br>'
          + '<input id=character-key maxlength=1>Character Info<br>'
          + '<input id=inventory-key maxlength=1>Inventory<br>'
          + '<input disabled value=ESC>Main Menu<br>'
          + '<input id=movement-keys maxlength=4>Move ↑←↓→<br>'
          + '<input disabled value="0 - 9">Select Spell<br>'
          + '<input id=spellbook-key maxlength=1>Spellbook</div><hr>'
          + '<div><input id=audio-volume max=1 min=0 step=0.01 type=range>Audio<br>'
          + '<input id=color type=color>Color<br>'
          + '<input id=ms-per-frame>ms/Frame<br>'
          + '<a onclick=reset()>Reset Settings</a></div></div>';
        update_settings();

    // New game mode.
    }else{
        if(newgame){
            save();
        }

        rpg_ui = 0;
        //rpg_spell_select(rpg_player['selected']);
    }
}

var key_down = false;
var key_left = false;
var key_right = false;
var key_up = false;
var mouse_lock_x = 0;
var mouse_lock_y = 0;
var mouse_x = 0;
var mouse_y = 0;

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
        rpg_spell_select(
          key === 48
            ? 10
            : key - 48
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

    }else if(key === settings['character-key']){
        rpg_ui = rpg_ui === 1
          ? 0
          : 1;

    }else if(key === settings['inventory-key']){
        rpg_ui = rpg_ui === 2
          ? 0
          : 2;

    }else if(key === settings['spellbook-key']){
        rpg_ui = rpg_ui === 3
          ? 0
          : 3;
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

    init_settings(
      'RPG-Above.htm-',
      {
        'audio-volume': 1,
        'character-key': 'C',
        'color': '#009900',
        'inventory-key': 'B',
        'movement-keys': 'WASD',
        'ms-per-frame': 25,
        'spellbook-key': 'V',
      }
    );
    init_canvas();
};

window.onmousedown = function(e){
    if(mode <= 0
      || (mouse_x <= 200
        && mouse_y <= 250)){
        return;
    }

    e.preventDefault();
    mouse_lock_x = mouse_x;
    mouse_lock_y = mouse_y;
};

window.onmousemove = function(e){
    if(mode <= 0
      || !game_running){
        return;
    }

    mouse_x = e.pageX;
    mouse_y = e.pageY;
};

window.onmouseup = function(e){
    mouse_lock_x = -1;
};
