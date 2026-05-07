package com.gsd.app;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

public class GsdWidget4x2 extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager mgr, int[] ids) {
        for (int id : ids) {
            WidgetHelper.updateWidget(context, mgr, id, R.layout.widget_4x2, 3);
        }
    }
}
