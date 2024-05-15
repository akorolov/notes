<script>
// @ts-nocheck

import { onMount, onDestroy } from 'svelte';
import { Datepicker } from 'vanillajs-datepicker';

let element;
let datepicker;

export let selected_date = new Date()


onMount(() => {
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