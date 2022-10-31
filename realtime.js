var frequency = 10000; // 10 seconds in miliseconds
var interval_update = 0;

$(document).ready(function(){
    loadData();
    startLoop();
});

// STARTS and Resets the loop
function startLoop() {
    if (interval_update > 0) clearInterval(interval_update); // stop
    interval_update = setInterval("loadData()", frequency); // run
}

function loadData() {
    $('.id_machine').each(function(i, obj) {
        var id_machine;
        var qty_process;
        var qty_accum;
        var qty_complete;
        var qty_order;
        var qty_per_tray;
        var percent;
        var item_no;
        var run_time_std;
        var run_time_actual;
        var run_time_open;
        var status_work;
        var rework;
        var qty_manual;
        const options = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };
        const options_run_time_open = {
            minimumIntegerDigits: 2,
            useGrouping: false
        }
        const seconds_of_a_day = 86400;
        var run_time_open_temp;
        var est_time;
        var time_now;
        var run_time_day=0, run_time_hr=0, run_time_min=0, run_time_sec=0;
        var task_complete, status_backup;

        id_machine = $(this).html();
        item_no = $(this).next().next().text();
        if (item_no!=''){
            $.ajax({
                url: "ajax/pp-machine-refresh.php",
                type: "GET",
                data: {
                    id_mc: id_machine
                },
                context: this,
                cache: false,
                success: function(dataResult){
                    var dataResult = JSON.parse(dataResult);
                    qty_process = parseInt(dataResult.qty_process);
                    qty_order = parseInt(dataResult.qty_order);
                    qty_complete = parseInt(dataResult.qty_complete);
                    qty_per_tray = parseInt(dataResult.qty_per_tray);
                    task_complete = parseInt(dataResult.task_complete);
                    status_backup = parseInt(dataResult.status_backup);
                    status_work = parseInt(dataResult.status_work);
                    divider = parseFloat(dataResult.divider);
                    rework = dataResult.rework;
                    qty_manual = parseInt(dataResult.qty_manual);

                    qty_accum = qty_complete + qty_process + qty_manual;
                    percent = Math.round((qty_accum/qty_order)*100);

                    run_time_std = parseFloat(dataResult.run_time_std); // UNIT = SECONDS
                    run_time_actual = parseFloat(dataResult.run_time_actual); // UNIT = SECONDS
                    run_time_open = ((qty_order-qty_accum)*run_time_std); // UNIT = SECONDS

                    run_time_open_temp = run_time_open;
                    run_time_day = Math.floor(run_time_open_temp/seconds_of_a_day);
                    run_time_open_temp %= seconds_of_a_day;
                    run_time_hr = Math.floor(run_time_open_temp/3600);
                    run_time_open_temp %= 3600;
                    run_time_min = Math.floor(run_time_open_temp/60);
                    run_time_sec = run_time_open_temp % 60;

                    $(this).parent().find('.progress-bar').text(percent + '%');
                    $(this).parent().find('.progress-bar').attr('aria-valuenow', percent);
                    $(this).parent().find('.progress-bar').css('width', percent + "%")

                    if (qty_order - qty_accum <= 500){
                        $(this).parent().find('.progress-bar').addClass('blink_me bg-orange');
                    }else {
                        $(this).parent().find('.progress-bar').removeClass('blink_me bg-orange');
                    }

                    $(this).parent().find('.qty_accum_order').html(qty_accum.toLocaleString('en-US') + ' / ' + qty_order.toLocaleString('en-US'));
                    $(this).parent().find('.qty_per_tray').text(qty_per_tray);
                    $(this).parent().find('.run_time').html("<i class=\"fas fa-flag\"></i> " + run_time_actual.toLocaleString('en-US', options) + ' / ' + run_time_std.toLocaleString('en-US', options));
                    if (run_time_hr<0 || run_time_min<0 || run_time_sec<0){
                        $(this).parent().find('.run_time_open').text("N/A");
                    }else {
                        $(this).parent().find('.run_time_open').text(run_time_day + " days\n" + run_time_hr.toLocaleString('en-US', options_run_time_open) + ":" + run_time_min.toLocaleString('en-US', options_run_time_open) + ":" + run_time_sec.toLocaleString('en-US', options_run_time_open));
                    }

                    // ADD BREAK TIME (1/2 HOUR) IN THE CURRENT DAY
                    time_now = new Date().getTime();
                    now_date = new Date().getDate();
                    now_hr = parseInt(new Date(time_now).toLocaleTimeString('es-CL').substr(0, 2));
                    now_min = parseInt(new Date(time_now).toLocaleTimeString('es-CL').substr(3, 2));
                    now_sec = parseInt(new Date(time_now).toLocaleTimeString('es-CL').substr(6, 2));

                    const break_3am_start = 10800;
                    const break_3am_stop = 12600;
                    const break_11am_start = 39600;
                    const break_11am_stop = 41400;
                    const break_6pm_start = 64800;
                    const break_6pm_stop = 66600;
                    var midnight = new Date();
                    midnight.setHours( 0 );
                    midnight.setMinutes( 0 );
                    midnight.setSeconds( 0 );
                    midnight.setMilliseconds( 0 );
                    var seconds_of_this_day=0,seconds_to_complete=0;
                    seconds_of_this_day = Math.floor((new Date().getTime() - midnight.getTime())/1000);

                    if (run_time_day>0){
                        run_time_open = run_time_open + (run_time_day*5400);                        // ADD 3 BREAKS IN CASE THE WORKING DAYS > 0
                    }
                    run_time_open_temp = run_time_open % seconds_of_a_day;                          // FIND SECONDS IN A DAY TO COMPLETE -- FROM MIDNIGHT
                    seconds_to_complete = run_time_open_temp + seconds_of_this_day;                 // FIND SECONDS IN A DAY TO COMPLETE -- FROM NOW

                    if (seconds_to_complete > break_3am_start){                                     // IF COMPLETE TIME AFTER BREAK TIME 3AM TODAY
                        if (seconds_of_this_day < break_3am_start){                                 // AND NOW IS NOT 3AM YET
                            run_time_open += 1800;                                                  // ADD FULL BREAK DURATION
                        }
                        else if (seconds_of_this_day < break_3am_stop) {                            // BUT IF NOW IS DURING THE BREAK TIME TODAY
                            run_time_open = run_time_open + (break_3am_stop - seconds_of_this_day); // ADD ONLY THE DIFFERENCE
                        }
                    }
                    if (seconds_to_complete > break_11am_start){                                    // IF COMPLETE TIME AFTER BREAK TIME 11AM TODAY
                        if (seconds_of_this_day < break_11am_start){                                // AND NOW IS NOT 11AM YET
                            run_time_open += 1800;                                                  // ADD FULL BREAK DURATION
                        }
                        else if (seconds_of_this_day < break_11am_stop) {                           // BUT IF NOW IS DURING THE BREAK TIME TODAY
                            run_time_open = run_time_open + (break_11am_stop - seconds_of_this_day);// ADD ONLY THE DIFFERENCE
                        }
                    }
                    if (seconds_to_complete > break_6pm_start){                                     // IF COMPLETE TIME AFTER BREAK TIME 6PM TODAY
                        if (seconds_of_this_day < break_6pm_start){                                 // AND NOW IS NOT 6PM YET
                            run_time_open += 1800;                                                  // ADD FULL BREAK DURATION
                        }
                        else if (seconds_of_this_day < break_6pm_stop) {                            // BUT IF NOW IS DURING THE BREAK TIME TODAY
                            run_time_open = run_time_open + (break_6pm_stop - seconds_of_this_day); // ADD ONLY THE DIFFERENCE
                        }
                    }
                    if (seconds_to_complete > seconds_of_a_day){
                        var seconds_of_tomorrow = seconds_to_complete%seconds_of_a_day;
                        if (seconds_of_tomorrow > break_3am_start){                                 // IF COMPLETE TIME AFTER BREAK TIME 3AM TOMORROW
                            run_time_open += 1800;                                                  // ADD FULL BREAK DURATION
                        }
                        if (seconds_of_tomorrow > break_11am_start){                                // IF COMPLETE TIME AFTER BREAK TIME 11AM TOMORROW
                            run_time_open += 1800;                                                  // ADD FULL BREAK DURATION
                        }
                        if (seconds_of_tomorrow > break_6pm_start){                                 // IF COMPLETE TIME AFTER BREAK TIME 6PM TOMORROW
                            run_time_open += 1800;                                                  // ADD FULL BREAK DURATION
                        }
                    }

                    est_time = new Date(time_now + (run_time_open*1000));
                    $(this).parent().find('.est_date').text(est_time.toLocaleDateString('es-CL'));
                    $(this).parent().find('.est_time').text(est_time.toLocaleTimeString('es-CL'));

                    if(run_time_actual>run_time_std){
                        $(this).parent().find('.fa-flag').addClass('blink_me');
                        $(this).parent().find('.run_time').addClass('text-red');
                        $(this).parent().find('.fa-flag').removeClass('text-black-25');
                    }else {
                        $(this).parent().find('.fa-flag').removeClass('blink_me');
                        $(this).parent().find('.run_time').removeClass('text-red');
                        $(this).parent().find('.fa-flag').addClass('text-black-25');
                    }

                    if(status_work==0 || status_work==3 || status_work==5 || status_work==6){
                        $(this).parent().find('.status_work').removeClass('bg-green bg-yellow bg-red');
                        $(this).parent().find('.status_work').text("");
                        $(this).parent().find('.status_work').append("<i class='status_work_icon fs-6'></i>");
                        $(this).parent().find('.status_work').addClass('bg-blue');
                    }else if(status_work==1){
                        $(this).parent().find('.status_work').removeClass('bg-blue bg-yellow bg-red');
                        $(this).parent().find('.status_work').text(dataResult.id_staff);
                        $(this).parent().find('.status_work').addClass('bg-green');
                    }else if(status_work==2){
                        $(this).parent().find('.status_work').removeClass('bg-blue bg-green bg-red');
                        $(this).parent().find('.status_work').text(dataResult.id_staff);
                        $(this).parent().find('.status_work').addClass('bg-yellow');
                    }else if(status_work==4){
                        $(this).parent().find('.status_work').removeClass('bg-blue bg-yellow bg-green');
                        $(this).parent().find('.status_work').text(dataResult.id_staff + '\n' + dataResult.code_downtime);
                        $(this).parent().find('.status_work').addClass('bg-red');
                    }

                    if(rework=='y'){
                        if($(this).parent().find('.status_work').text()!='  RW') {
                            $(this).parent().find('.status_work').append('  RW');
                        }
                    }else {
                        if($(this).parent().find('.status_work').parent().text()=='  RW') {
                            // alert($(this).parent().find('.status_work').parent().html());
                            $(this).parent().find('.status_work').parent().html($(this).parent().find('.status_work').parent().html().slice(0, -1));
                        }
                    }

                    if (task_complete==1) {
                        if (status_backup == 1) {
                            $(this).parent().find('.status_work_icon').removeClass('fas fa-circle fa-check-square');
                            $(this).parent().find('.status_work_icon').addClass('far fa-file-archive');
                        }else {
                            $(this).parent().find('.status_work .status_work_icon').removeClass('fas fa-circle fa-file-archive');
                            $(this).parent().find('.status_work .status_work_icon').addClass('far fa-check-square');
                        }
                    }else {
                        $(this).parent().find('.status_work_icon .status_work_icon').removeClass('far fa-check-square fa-file-archive');
                    }
                }
            });
        }
    });
}