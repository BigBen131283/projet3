//----------------------------------------------------------------------------
//    datetime.js
//
//    Oct 09 2019   Initial
//    Oct 10 2019   Timer for minutes
//    Oct 12 2019   export default is a problem for node
//    Oct 29 2019   Get other functions from helpers
//    Feb 09 2020   date format for browser use jj/mm/aaaa
//    Feb 10 2020   More work 
//    Feb 12 2020   New methods 
//    Aug 10 2021   Undeclared datetime ???? 
//    Mar 10 2022   Lightweight version of an existing lib ;-)
//----------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars

    const Version = 'datetime:1.15, Mar 10 2022';

    const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    
    export  { getDateTime, getDate, getTime, getHoursMinutes, getShortTime }
    //----------------------------------------------------------------------------
    // Full date & time string 
    // syncmode set to TRUE if waiting for the I/O to complete
    //----------------------------------------------------------------------------
    function getDateTime() {
        let d = new Date();
        return months[d.getMonth()] + '-' + d.getDate() + '-' + d.getFullYear() + ' ' 
                + d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") ;
    }
    function getDate() {
        let d = new Date();
        return months[d.getMonth()] + '-' + d.getDate() + '-' + d.getFullYear() + ' ';
    }
    
    function getTime() {
        let d = new Date();
        return d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") ;
    }
    function getShortTime() {
        return new Date().toTimeString().slice(0,5);
    }
    
    function getHoursMinutes() {
        let d = new Date();
        let time = d.getHours() + ':' + d.getMinutes();
        return time;
    }
    
    function getHoursMinutesSeconds() {
        let d = new Date();
        return d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    }
    
    function convertDateTime(thedate) {
        if (thedate) {
            let computedate = new Date(thedate);
            let day = computedate.getDate();
            let days = '';
            let datetime = null;
            if (day < 10) days = day.toString().replace(/.*(^\d{1}).*/, "0$1");
                else days = day.toString();
                    datetime = months[computedate.getMonth()] + '-' +  days + '-' 
                    + computedate.getFullYear() + ' ' 
                    + computedate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1"); 
            return datetime;
        }
        else {
            return "Unset"
        }
    }
    
    function convertSecondsToHMS(seconds) {
        let computedate = new Date(1970,0,1);
        computedate.setSeconds(seconds);
        return computedate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");    
    }
    
