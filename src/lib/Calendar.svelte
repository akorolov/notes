<script>
// @ts-nocheck

import { onMount, onDestroy } from 'svelte';
import { Datepicker } from 'vanillajs-datepicker';
import { calendar_setting } from './settingStore';
import { GetNoteDates, noteList } from './noteStore';

let element;
let datepicker;

export let selected_date = new Date()

let date_list = GetNoteDates($calendar_setting, $noteList)

$: $noteList, date_list = GetNoteDates($calendar_setting, $noteList)



onMount(() => {
    date_list = GetNoteDates($calendar_setting, $noteList)
    datepicker = new Datepicker(element, {
        buttonClass: 'btn',
        datesDisabled: function (date, viewId, rangeEnd) {
            // logic for return the date disabled or not
            return false;
        },
        maxDate: new Date(),
        todayHighlight: true,
        // todayButton: true,
        beforeShowDay: function (date) {
            // check if the date has any notes and if so add some extra little formatting
            if (date_list.some(d => (d.getDate() == date.getDate() && d.getMonth() == date.getMonth() && d.getFullYear() == date.getFullYear()))) {
                return {
                    classes: '',
                    content: date.getDate() + '<span class="bg-error-400 badge-icon h-2 w-2 ml-1" />',
                }
            }
            return {
                classes: '',
                content: '',
            }
        }
    })
    
})


</script>

<div class="flex flex-row justify-center mb-2">

<div id="datepicker" bind:this={element} on:changeDate={() => selected_date = datepicker.getDate()}>

</div>

</div>


<style>


</style>