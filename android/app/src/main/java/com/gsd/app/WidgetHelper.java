package com.gsd.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.widget.RemoteViews;

import org.json.JSONObject;

public class WidgetHelper {

    public static void updateWidget(Context context, AppWidgetManager mgr, int widgetId, int layoutId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), layoutId);

        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        String raw = prefs.getString("widget_state", null);

        String title = "GSD";
        String summary = "Öffne die App";
        int itemCount = 0;
        if (raw != null) {
            try {
                JSONObject obj = new JSONObject(raw);
                title = obj.optString("title", title);
                summary = obj.optString("summary", summary);
                itemCount = obj.optJSONArray("items") != null ? obj.optJSONArray("items").length() : 0;
            } catch (Exception ignored) {}
        }

        views.setTextViewText(R.id.widget_title, title);
        views.setTextViewText(R.id.widget_summary, summary);

        // Bind the ListView to the RemoteViewsService — the factory there reads the state JSON
        // and produces a row per item.
        Intent serviceIntent = new Intent(context, WidgetItemsService.class);
        serviceIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId);
        // Make the URI unique per widget so Android keeps separate adapters
        serviceIntent.setData(Uri.parse(serviceIntent.toUri(Intent.URI_INTENT_SCHEME)));
        views.setRemoteAdapter(R.id.widget_list, serviceIntent);

        // Empty view for when the state has no items
        if (itemCount == 0) {
            views.setViewVisibility(R.id.widget_list, android.view.View.GONE);
            views.setViewVisibility(R.id.widget_empty, android.view.View.VISIBLE);
        } else {
            views.setViewVisibility(R.id.widget_list, android.view.View.VISIBLE);
            views.setViewVisibility(R.id.widget_empty, android.view.View.GONE);
        }

        // PendingIntent template: each row's fill-in intent (set in the Factory) gets merged in here.
        // Templates MUST be mutable so the row's fill-in can fill in the URI.
        Intent itemTemplate = new Intent(context, MainActivity.class);
        itemTemplate.setAction(Intent.ACTION_VIEW);
        itemTemplate.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        int templateFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
            templateFlags |= PendingIntent.FLAG_MUTABLE;
        }
        PendingIntent itemPI = PendingIntent.getActivity(context, widgetId, itemTemplate, templateFlags);
        views.setPendingIntentTemplate(R.id.widget_list, itemPI);

        // Header click → open app to dashboard
        Intent openIntent = new Intent(context, MainActivity.class);
        openIntent.setAction(Intent.ACTION_VIEW);
        openIntent.setData(Uri.parse("gsd://heute"));
        openIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        int headerFlags = PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE;
        PendingIntent openPI = PendingIntent.getActivity(context, widgetId * 1000 + 1, openIntent, headerFlags);
        views.setOnClickPendingIntent(R.id.widget_header, openPI);

        mgr.updateAppWidget(widgetId, views);
        // Tell the ListView to repopulate its data (from the Factory)
        mgr.notifyAppWidgetViewDataChanged(widgetId, R.id.widget_list);
    }

    public static void refreshAll(Context context) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(context);
        int[] ids4x2 = mgr.getAppWidgetIds(new ComponentName(context, GsdWidget4x2.class));
        int[] ids4x4 = mgr.getAppWidgetIds(new ComponentName(context, GsdWidget4x4.class));
        for (int id : ids4x2) updateWidget(context, mgr, id, R.layout.widget_4x2);
        for (int id : ids4x4) updateWidget(context, mgr, id, R.layout.widget_4x4);
    }
}
