package sia.tasks_manager.utils;

import java.util.Calendar;
import java.util.Date;

public class DateUtils {
    public static Date getDateWithShift(Date currentDate, int shift) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.DAY_OF_YEAR, shift);
        return calendar.getTime();
    }

    public static boolean isSameDate(Date date1, Date date2) {
        Calendar calendar1 = getCalendarWithoutTime(date1);
        Calendar calendar2 = getCalendarWithoutTime(date2);

        return calendar1.getTime().equals(calendar2.getTime());
    }

    private static Calendar getCalendarWithoutTime(Date date) {
        Calendar calendar = Calendar.getInstance();

        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);

        return calendar;
    }
}
