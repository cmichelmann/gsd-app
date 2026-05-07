package com.gsd.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

public class WidgetHelper {

    // Up to 6 item rows in 4x4, 3 in 4x2 — must match layout XMLs.
    private static final int[] ITEM_ROW_IDS_4X4 = {
        R.id.widget_item_0, R.id.widget_item_1, R.id.widget_item_2,
        R.id.widget_item_3, R.id.widget_item_4, R.id.widget_item_5
    };
    private static final int[] ITEM_ICON_IDS_4X4 = {
        R.id.widget_item_0_icon, R.id.widget_item_1_icon, R.id.widget_item_2_icon,
        R.id.widget_item_3_icon, R.id.widget_item_4_icon, R.id.widget_item_5_icon
    };
    private static final int[] ITEM_TIME_IDS_4X4 = {
        R.id.widget_item_0_time, R.id.widget_item_1_time, R.id.widget_item_2_time,
        R.id.widget_item_3_time, R.id.widget_item_4_time, R.id.widget_item_5_time
    };
    private static final int[] ITEM_TITLE_IDS_4X4 = {
        R.id.widget_item_0_title, R.id.widget_item_1_title, R.id.widget_item_2_title,
        R.id.widget_item_3_title, R.id.widget_item_4_title, R.id.widget_item_5_title
    };

    public static void updateWidget(Context context, AppWidgetManager mgr, int widgetId, int layoutId, int maxItems) {
        RemoteViews views = new RemoteViews(context.getPackageName(), layoutId);

        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        String raw = prefs.getString("widget_state", null);

        String title = "GSD";
        String summary = "Öffne die App";
        JSONArray items = new JSONArray();
        JSONArray habits = new JSONArray();
        if (raw != null) {
            try {
                JSONObject obj = new JSONObject(raw);
                title = obj.optString("title", title);
                summary = obj.optString("summary", summary);
                items = obj.optJSONArray("items");
                if (items == null) items = new JSONArray();
                habits = obj.optJSONArray("habits");
                if (habits == null) habits = new JSONArray();
            } catch (Exception ignored) {}
        }

        views.setTextViewText(R.id.widget_title, title);
        views.setTextViewText(R.id.widget_summary, summary);

        // Item rows — up to maxItems, hide unused ones
        for (int i = 0; i < ITEM_ROW_IDS_4X4.length && i < maxItems; i++) {
            if (i < items.length()) {
                JSONObject it = items.optJSONObject(i);
                if (it == null) continue;
                String icon = it.optString("icon", "");
                String time = it.optString("time", "");
                String itTitle = it.optString("title", "");
                String deepLink = it.optString("deepLink", "");
                views.setViewVisibility(ITEM_ROW_IDS_4X4[i], android.view.View.VISIBLE);
                views.setTextViewText(ITEM_ICON_IDS_4X4[i], icon);
                views.setTextViewText(ITEM_TIME_IDS_4X4[i], time);
                views.setTextViewText(ITEM_TITLE_IDS_4X4[i], itTitle);
                if (!deepLink.isEmpty()) {
                    Intent itemIntent = new Intent(context, MainActivity.class);
                    itemIntent.setAction(Intent.ACTION_VIEW);
                    itemIntent.setData(Uri.parse(deepLink));
                    itemIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    PendingIntent itemPI = PendingIntent.getActivity(
                        context, widgetId * 100 + i, itemIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                    );
                    views.setOnClickPendingIntent(ITEM_ROW_IDS_4X4[i], itemPI);
                }
            } else {
                views.setViewVisibility(ITEM_ROW_IDS_4X4[i], android.view.View.GONE);
            }
        }

        // Habits row at bottom (4x4 only — has the view)
        if (layoutId == R.layout.widget_4x4) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < habits.length() && i < 8; i++) {
                JSONObject h = habits.optJSONObject(i);
                if (h == null) continue;
                String emoji = h.optString("emoji", "");
                boolean done = h.optBoolean("done", false);
                if (sb.length() > 0) sb.append("  ");
                if (done) {
                    // Strikethrough indicator: use a check
                    sb.append("✓").append(emoji);
                } else {
                    sb.append(emoji);
                }
            }
            if (sb.length() > 0) {
                views.setViewVisibility(R.id.widget_habits, android.view.View.VISIBLE);
                views.setTextViewText(R.id.widget_habits, sb.toString());
            } else {
                views.setViewVisibility(R.id.widget_habits, android.view.View.GONE);
            }
        }

        // Header click → open app to dashboard
        Intent openIntent = new Intent(context, MainActivity.class);
        openIntent.setAction(Intent.ACTION_VIEW);
        openIntent.setData(Uri.parse("gsd://heute"));
        openIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent openPI = PendingIntent.getActivity(
            context, widgetId, openIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_header, openPI);

        mgr.updateAppWidget(widgetId, views);
    }

    public static void refreshAll(Context context) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(context);
        int[] ids4x2 = mgr.getAppWidgetIds(new ComponentName(context, GsdWidget4x2.class));
        int[] ids4x4 = mgr.getAppWidgetIds(new ComponentName(context, GsdWidget4x4.class));
        for (int id : ids4x2) updateWidget(context, mgr, id, R.layout.widget_4x2, 3);
        for (int id : ids4x4) updateWidget(context, mgr, id, R.layout.widget_4x4, 6);
    }
}
