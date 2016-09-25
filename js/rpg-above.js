'use strict';

function draw_logic(){
    canvas_buffer.save();
    canvas_buffer.translate(
      canvas_x,
      canvas_y
    );

    canvas_buffer.save();
    canvas_buffer.translate(
      -rpg_player['x'],
      -rpg_player['y']
    );

    // Draw static world objects.
    for(var object in rpg_world_static){
        canvas_buffer.fillStyle = rpg_world_static[object]['color'];
        canvas_buffer.fillRect(
          rpg_world_static[object]['x'],
          rpg_world_static[object]['y'],
          rpg_world_static[object]['width'],
          rpg_world_static[object]['height']
        );
    }

    // Draw dynamic world objects.
    for(var object in rpg_world_dynamic){
        canvas_buffer.fillStyle = rpg_world_dynamic[object]['color'];
        canvas_buffer.fillRect(
          rpg_world_dynamic[object]['x'],
          rpg_world_dynamic[object]['y'],
          rpg_world_dynamic[object]['width'],
          rpg_world_dynamic[object]['height']
        );
    }

    // Draw NPCs.
    for(var npc in rpg_npcs){
        canvas_buffer.fillStyle = rpg_npcs[npc]['color'];
        canvas_buffer.fillRect(
          rpg_npcs[npc]['x'] - rpg_npcs[npc]['width-half'],
          rpg_npcs[npc]['y'] - rpg_npcs[npc]['height-half'],
          rpg_npcs[npc]['width'],
          rpg_npcs[npc]['height']
        );
    }

    // Draw particles.
    for(var particle in rpg_particles){
        canvas_buffer.fillStyle = rpg_particles[particle]['color'];
        canvas_buffer.fillRect(
          rpg_particles[particle]['x'] - rpg_particles[particle]['width-half'],
          rpg_particles[particle]['y'] - rpg_particles[particle]['height-half'],
          rpg_particles[particle]['width'],
          rpg_particles[particle]['height']
        );
    }

    canvas_buffer.restore();

    // Draw player and targeting direction.
    canvas_buffer.fillStyle = settings_settings['color'];
    canvas_buffer.fillRect(
      -rpg_player['width-half'],
      -rpg_player['height-half'],
      rpg_player['width'],
      rpg_player['height']
    );
    var endpoint = math_fixed_length_line(
      0,
      0,
      mouse_x - canvas_x,
      mouse_y - canvas_y,
      25
    );
    canvas_buffer.beginPath();
    canvas_buffer.moveTo(
      0,
      0
    );
    canvas_buffer.lineTo(
      endpoint['x'],
      endpoint['y']
    );
    canvas_buffer.closePath();
    canvas_buffer.strokeStyle = '#fff';
    canvas_buffer.stroke();

    canvas_buffer.restore();

    // Draw UI.
    canvas_buffer.fillStyle = '#444';
    canvas_buffer.fillRect(
      0,
      0,
      200,
      200
    );

    canvas_buffer.fillStyle = '#0a0';
    canvas_buffer.fillRect(
      0,
      0,
      200 * (rpg_player['stats']['health']['current'] / rpg_player['stats']['health']['max']),
      100
    );
    canvas_buffer.fillStyle = '#66f';
    canvas_buffer.fillRect(
      0,
      100,
      200 * (rpg_player['stats']['mana']['current'] / rpg_player['stats']['mana']['max']),
      100
    );

    // Setup text display.
    canvas_buffer.fillStyle = '#fff';
    canvas_buffer.font = canvas_fonts['medium'];
    canvas_buffer.textAlign = 'center';
    canvas_buffer.textBaseline = 'middle';

    canvas_buffer.fillText(
      rpg_player['stats']['health']['current'],
      50,
      25
    );
    canvas_buffer.fillText(
      rpg_player['stats']['health']['max'],
      50,
      75
    );
    canvas_buffer.fillText(
      rpg_player['stats']['mana']['current'],
      50,
      125
    );
    canvas_buffer.fillText(
      rpg_player['stats']['mana']['max'],
      50,
      175
    );
    canvas_buffer.fillText(
      parseInt(
        rpg_player['stats']['health']['current'] * 100 / rpg_player['stats']['health']['max'],
        10
      ) + '%',
      150,
      25
    );
    canvas_buffer.fillText(
      rpg_player['stats']['health']['regeneration']['current']
        + '/' + rpg_player['stats']['health']['regeneration']['max'],
      150,
      75
    );
    canvas_buffer.fillText(
      parseInt(
        rpg_player['stats']['mana']['current'] * 100 / rpg_player['stats']['mana']['max'],
        10
      ) + '%',
      150,
      125
    );
    canvas_buffer.fillText(
      rpg_player['stats']['mana']['regeneration']['current']
        + '/' + rpg_player['stats']['mana']['regeneration']['max'],
      150,
      175
    );

    // Draw selected UI.
    canvas_buffer.textAlign = 'left';
    canvas_buffer.fillText(
      rpg_player['spellbar'][rpg_player['selected']],
      10,
      225
    );
    if(rpg_ui === 1){
        canvas_buffer.fillText(
          'CHARACTER',
          205,
          13
        );

    }else if(rpg_ui === 2){
        canvas_buffer.fillText(
          'Inventory is empty.',
          205,
          13
        );

    }else if(rpg_ui === 3){
        for(var spell in rpg_player['spellbar']){
            canvas_buffer.fillText(
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
    if(rpg_player['dead']){
        canvas_buffer.fillStyle = '#f00';
        canvas_buffer.font = canvas_fonts['big'];
        canvas_buffer.textAlign = 'center';
        canvas_buffer.fillText(
          'YOU ARE DEAD',
          canvas_x,
          175
        );
    }
}

function logic(){
    if(canvas_menu){
        return;
    }

    var player_dx = 0;
    var player_dy = 0;

    if(!rpg_player['dead']){
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
    }

    // Check for player collision with dynamic world objects.
    for(var object in rpg_world_dynamic){
        if(rpg_world_dynamic[object]['effect'] === 0
          && !rpg_world_dynamic[object]['collision']){
            continue;
        }

        var temp_object_right_x = rpg_world_dynamic[object]['x'] + rpg_world_dynamic[object]['width'];
        var temp_object_right_y = rpg_world_dynamic[object]['y'] + rpg_world_dynamic[object]['height'];

        if(rpg_player['x'] + player_dx - rpg_player['width-half'] > temp_object_right_x
          || rpg_player['x'] + player_dx + rpg_player['width-half'] < rpg_world_dynamic[object]['x']
          || rpg_player['y'] + player_dy - rpg_player['height-half'] > temp_object_right_y
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
          && rpg_player['y'] < temp_object_right_y + rpg_player['height-half']){
            if(key_left
              && rpg_player['y'] + player_dy + rpg_player['height-half'] > rpg_world_dynamic[object]['y']
              && rpg_player['y'] + player_dy - rpg_player['height-half'] < temp_object_right_y
              && rpg_player['x'] + player_dx - rpg_player['width-half'] < temp_object_right_x){
                player_dx = 0;

            }else if(key_right
              && rpg_player['y'] + player_dy + rpg_player['height-half'] > rpg_world_dynamic[object]['y']
              && rpg_player['y'] + player_dy - rpg_player['height-half'] < temp_object_right_y
              && rpg_player['x'] + player_dx + rpg_player['width-half'] > rpg_world_dynamic[object]['x']){
                player_dx = 0;
            }
        }

        if(key_down
          && rpg_player['x'] + player_dx + rpg_player['width-half'] > rpg_world_dynamic[object]['x']
          && rpg_player['x'] + player_dx - rpg_player['width-half'] < temp_object_right_x
          && rpg_player['y'] + player_dy + rpg_player['height-half'] > rpg_world_dynamic[object]['y']){
            player_dy = 0;

        }else if(key_up
          && rpg_player['x'] + player_dx + rpg_player['width-half'] > rpg_world_dynamic[object]['x']
          && rpg_player['x'] + player_dx - rpg_player['width-half'] < temp_object_right_x
          && rpg_player['y'] + player_dy - rpg_player['height-half'] < temp_object_right_y){
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
    if(canvas_mode <= 0){
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
    rpg_npcs.length = 0;
    rpg_particles.length = 0;
    rpg_world_dynamic.length = 0;
    rpg_world_static.length = 0;

    // Main menu mode.
    if(canvas_mode === 0){
        document.body.innerHTML = '<div><div><a onclick="canvas_setmode(1, true)">Test Level</a></div></div>'
          + '<div class=right><div><input disabled value=Click>Cast Spell<br>'
          + '<input id=character-key maxlength=1>Character Info<br>'
          + '<input id=inventory-key maxlength=1>Inventory<br>'
          + '<input disabled value=ESC>Menu<br>'
          + '<input id=movement-keys maxlength=4>Move ↑←↓→<br>'
          + '<input disabled value="0 - 9">Select Spell<br>'
          + '<input id=spellbook-key maxlength=1>Spellbook</div><hr>'
          + '<div><input id=audio-volume max=1 min=0 step=0.01 type=range>Audio<br>'
          + '<input id=color type=color>Color<br>'
          + '<input id=ms-per-frame>ms/Frame<br>'
          + '<a onclick=settings_reset()>Reset Settings</a></div></div>';
        settings_update();

    // New game mode.
    }else{
        if(newgame){
            settings_save();
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
    if(canvas_mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // ESC: menu.
    if(key === 27){
        canvas_menu_toggle();
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

    if(key === settings_settings['movement-keys'][0]){
        key_up = true;

    }else if(key === settings_settings['movement-keys'][1]){
        key_left = true;

    }else if(key === settings_settings['movement-keys'][2]){
        key_down = true;

    }else if(key === settings_settings['movement-keys'][3]){
        key_right = true;

    }else if(key === settings_settings['character-key']){
        rpg_ui = rpg_ui === 1
          ? 0
          : 1;

    }else if(key === settings_settings['inventory-key']){
        rpg_ui = rpg_ui === 2
          ? 0
          : 2;

    }else if(key === settings_settings['spellbook-key']){
        rpg_ui = rpg_ui === 3
          ? 0
          : 3;

    }else if(key === 'Q'){
        canvas_menu_quit();
    }
};

window.onkeyup = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === settings_settings['movement-keys'][0]){
        key_up = false;

    }else if(key === settings_settings['movement-keys'][1]){
        key_left = false;

    }else if(key === settings_settings['movement-keys'][2]){
        key_down = false;

    }else if(key === settings_settings['movement-keys'][3]){
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

    settings_init(
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
    canvas_init();
};

window.onmousedown = function(e){
    if(canvas_mode <= 0
      || (mouse_x <= 200
        && mouse_y <= 250)){
        return;
    }

    e.preventDefault();
    mouse_lock_x = mouse_x;
    mouse_lock_y = mouse_y;
};

window.onmousemove = function(e){
    if(canvas_mode <= 0){
        return;
    }

    mouse_x = e.pageX;
    mouse_y = e.pageY;
};

window.onmouseup = function(e){
    mouse_lock_x = -1;
};
