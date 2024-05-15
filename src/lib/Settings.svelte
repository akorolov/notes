<script lang="ts">

import { calendar_setting } from "./settingStore";
import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";


</script>


<div class="flex flex-col p-2 gap-2">
    <span class="flex flex-row gap-2 items-center justify-between">
        <span class="h5">Calendar: </span>
        <RadioGroup padding='px-2 py-1'>
            <RadioItem bind:group={$calendar_setting} name="calendar" value={"updated"}>Updated</RadioItem>
            <RadioItem bind:group={$calendar_setting} name="calendar" value={"created"}>Created</RadioItem>
        </RadioGroup>
    </span>  

    <hr />
</div>