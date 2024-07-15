<template>
  <full-calendar
    ref="fullCalendar"
    :options="fullCalendarOptions"
  />
</template>
<script>
import FullCalendarVue from '@fullcalendar/vue'
import FullCalendarDayGrid from '@fullcalendar/daygrid'
import FullCalendarTimeGrid from '@fullcalendar/timegrid'
import FullCalendarList from '@fullcalendar/list'
import FullCalendarBootstrap from '@fullcalendar/bootstrap'
import FullcalendarLocales from '@platform/locales/fullcalendar'
import I18n from '@platform/utils/i18n'
import '@fullcalendar/bootstrap/main.css'
import '@fullcalendar/common/main.css'
import '@fullcalendar/daygrid/main.css'
export default {
  components: {
    'full-calendar': FullCalendarVue
  },
  props: {
    options: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      calendarOptions: {
        plugins: [FullCalendarDayGrid, FullCalendarTimeGrid, FullCalendarList, FullCalendarBootstrap],
        initialView: 'dayGridMonth'
      }
    }
  },
  computed: {
    fullCalendarOptions() {
      const options = Object.assign({
        locales: FullcalendarLocales.locales,
        locale: this.locale
      }, this.calendarOptions, this.options)
      return options
    },
    locale() {
      return FullcalendarLocales.localeMap[I18n.getLanguage()]
    }
  },
  beforeDestroy() {
    this.calendarOptions = null
  }
}
</script>
