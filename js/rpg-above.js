'use strict';

function draw_logic(){
    canvas_buffer.save();
    canvas_buffer.translate(
      canvas_x,
      canvas_y
    );

    canvas_buffer.save();
    canvas_buffer.translate(
      -rpg_characters[0]['x'],
      -rpg_characters[0]['y']
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

    // Draw characters.
    for(var character in rpg_characters){
        canvas_buffer.fillStyle = rpg_characters[character]['color'];
        canvas_buffer.fillRect(
          rpg_characters[character]['x'] - rpg_characters[character]['width-half'],
          rpg_characters[character]['y'] - rpg_characters[character]['height-half'],
          rpg_characters[character]['width'],
          rpg_characters[character]['height']
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

    // Draw player targeting direction.
    var endpoint = math_fixed_length_line({
      'length': 25,
      'x0': 0,
      'x1': mouse_x - canvas_x,
      'y0': 0,
      'y1': mouse_y - canvas_y,
    });
    canvas_draw_path({
      'properties': {
        'strokeStyle': '#fff',
      },
      'style': 'stroke',
      'vertices': [
        {
          'type': 'moveTo',
          'x': 0,
          'y': 0,
        },
        {
          'x': endpoint['x'],
          'y': endpoint['y'],
        },
      ],
    });

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
      200 * (rpg_characters[0]['stats']['health']['current'] / rpg_characters[0]['stats']['health']['max']),
      100
    );
    canvas_buffer.fillStyle = '#66f';
    canvas_buffer.fillRect(
      0,
      100,
      200 * (rpg_characters[0]['stats']['mana']['current'] / rpg_characters[0]['stats']['mana']['max']),
      100
    );

    // Setup text display.
    canvas_buffer.fillStyle = '#fff';
    canvas_buffer.font = canvas_fonts['medium'];
    canvas_buffer.textAlign = 'center';
    canvas_buffer.textBaseline = 'middle';

    canvas_buffer.fillText(
      rpg_characters[0]['stats']['health']['current'],
      50,
      25
    );
    canvas_buffer.fillText(
      rpg_characters[0]['stats']['health']['max'],
      50,
      75
    );
    canvas_buffer.fillText(
      rpg_characters[0]['stats']['mana']['current'],
      50,
      125
    );
    canvas_buffer.fillText(
      rpg_characters[0]['stats']['mana']['max'],
      50,
      175
    );
    canvas_buffer.fillText(
      parseInt(
        rpg_characters[0]['stats']['health']['current'] * 100 / rpg_characters[0]['stats']['health']['max'],
        10
      ) + '%',
      150,
      25
    );
    canvas_buffer.fillText(
      rpg_characters[0]['stats']['health']['regeneration']['current']
        + '/' + rpg_characters[0]['stats']['health']['regeneration']['max'],
      150,
      75
    );
    canvas_buffer.fillText(
      parseInt(
        rpg_characters[0]['stats']['mana']['current'] * 100 / rpg_characters[0]['stats']['mana']['max'],
        10
      ) + '%',
      150,
      125
    );
    canvas_buffer.fillText(
      rpg_characters[0]['stats']['mana']['regeneration']['current']
        + '/' + rpg_characters[0]['stats']['mana']['regeneration']['max'],
      150,
      175
    );

    // Draw selected UI.
    canvas_buffer.textAlign = 'left';
    canvas_buffer.fillText(
      rpg_characters[0]['inventory'][rpg_characters[0]['selected']]['label'],
      210,
      25
    );

    // Draw game over messages.
    if(rpg_characters[0]['dead']){
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

    if(!rpg_characters[0]['dead']){
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

        if(rpg_characters[0]['x'] + player_dx - rpg_characters[0]['width-half'] > temp_object_right_x
          || rpg_characters[0]['x'] + player_dx + rpg_characters[0]['width-half'] < rpg_world_dynamic[object]['x']
          || rpg_characters[0]['y'] + player_dy - rpg_characters[0]['height-half'] > temp_object_right_y
          || rpg_characters[0]['y'] + player_dy + rpg_characters[0]['height-half'] < rpg_world_dynamic[object]['y']){
            continue;
        }

        if(rpg_world_dynamic[object]['effect'] > 0){
            rpg_character_affect({
              'character': 0,
              'effect': rpg_world_dynamic[object]['effect'],
              'stat': rpg_world_dynamic[object]['effect-stat'],
            });
        }

        if(!rpg_world_dynamic[object]['collision']){
            continue;
        }

        if(rpg_characters[0]['y'] > rpg_world_dynamic[object]['y'] - rpg_characters[0]['height-half']
          && rpg_characters[0]['y'] < temp_object_right_y + rpg_characters[0]['height-half']){
            if(key_left
              && rpg_characters[0]['y'] + player_dy + rpg_characters[0]['height-half'] > rpg_world_dynamic[object]['y']
              && rpg_characters[0]['y'] + player_dy - rpg_characters[0]['height-half'] < temp_object_right_y
              && rpg_characters[0]['x'] + player_dx - rpg_characters[0]['width-half'] < temp_object_right_x){
                player_dx = 0;

            }else if(key_right
              && rpg_characters[0]['y'] + player_dy + rpg_characters[0]['height-half'] > rpg_world_dynamic[object]['y']
              && rpg_characters[0]['y'] + player_dy - rpg_characters[0]['height-half'] < temp_object_right_y
              && rpg_characters[0]['x'] + player_dx + rpg_characters[0]['width-half'] > rpg_world_dynamic[object]['x']){
                player_dx = 0;
            }
        }

        if(key_down
          && rpg_characters[0]['x'] + player_dx + rpg_characters[0]['width-half'] > rpg_world_dynamic[object]['x']
          && rpg_characters[0]['x'] + player_dx - rpg_characters[0]['width-half'] < temp_object_right_x
          && rpg_characters[0]['y'] + player_dy + rpg_characters[0]['height-half'] > rpg_world_dynamic[object]['y']){
            player_dy = 0;

        }else if(key_up
          && rpg_characters[0]['x'] + player_dx + rpg_characters[0]['width-half'] > rpg_world_dynamic[object]['x']
          && rpg_characters[0]['x'] + player_dx - rpg_characters[0]['width-half'] < temp_object_right_x
          && rpg_characters[0]['y'] + player_dy - rpg_characters[0]['height-half'] < temp_object_right_y){
            player_dy = 0;
        }
    }

    // Update actual player position.
    rpg_characters[0]['x'] += player_dx;
    rpg_characters[0]['y'] += player_dy;

    rpg_character_handle();
    rpg_particle_handle();
}

function mouse_wheel(e){
    if(canvas_mode <= 0){
        return;
    }

    rpg_item_select({
      'id': rpg_characters[0]['selected']
        + (
          (e.wheelDelta || -e.detail) > 0
            ? -1
            : 1
        ),
    });
}

function setmode_logic(newgame){
    rpg_unload();

    // Main menu mode.
    if(canvas_mode === 0){
        document.body.innerHTML = '<div><div><a onclick=canvas_setmode({mode:1,newgame:true})>Test Level</a></div></div>'
          + '<div class=right><div><input disabled value=Click>Use Item<br>'
          + '<input disabled value=ESC>Menu<br>'
          + '<input id=movement-keys maxlength=4>Move ↑←↓→<br>'
          + '<input disabled value=Wheel>Select Items/Spells</div><hr>'
          + '<div><input id=audio-volume max=1 min=0 step=0.01 type=range>Audio<br>'
          + '<input id=color type=color>Color<br>'
          + '<input id=ms-per-frame>ms/Frame<br>'
          + '<a onclick=storage_reset()>Reset Settings</a></div></div>';
        storage_update();

    // New game mode.
    }else if(newgame){
        storage_save();
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

window.onload = function(e){
    storage_init({
      'data': {
        'audio-volume': 1,
        'color': '#009900',
        'movement-keys': 'WASD',
        'ms-per-frame': 25,
      },
      'prefix': 'RPG-Above.htm-',
    });
    canvas_init();

    window.onkeydown = function(e){
        if(canvas_mode <= 0){
            return;
        }

        var key = e.keyCode || e.which;

        // ESC: menu.
        if(key === 27){
            canvas_menu_toggle();
            return;
        }

        key = String.fromCharCode(key);

        if(key === storage_data['movement-keys'][0]){
            key_up = true;

        }else if(key === storage_data['movement-keys'][1]){
            key_left = true;

        }else if(key === storage_data['movement-keys'][2]){
            key_down = true;

        }else if(key === storage_data['movement-keys'][3]){
            key_right = true;

        }else if(key === 'Q'){
            canvas_menu_quit();
        }
    };

    window.onkeyup = function(e){
        var key = String.fromCharCode(e.keyCode || e.which);

        if(key === storage_data['movement-keys'][0]){
            key_up = false;

        }else if(key === storage_data['movement-keys'][1]){
            key_left = false;

        }else if(key === storage_data['movement-keys'][2]){
            key_down = false;

        }else if(key === storage_data['movement-keys'][3]){
            key_right = false;
        }
    };

    window.onmousedown = function(e){
        if(canvas_mode <= 0
          || (mouse_x <= 200
            && mouse_y <= 200)){
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

    if('onmousewheel' in window){
        window.onmousewheel = mouse_wheel;

    }else{
        document.addEventListener(
          'DOMMouseScroll',
          mouse_wheel,
          false
        );
    }
};
