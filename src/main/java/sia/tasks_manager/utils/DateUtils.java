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
}
