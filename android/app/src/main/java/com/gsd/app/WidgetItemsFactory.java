package com.gsd.app;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class WidgetItemsFactory implements RemoteViewsService.RemoteViewsFactory {
    private final Context context;
    private final List<JSONObject> items = new ArrayList<>();

    public WidgetItemsFactory(Context context) {
        this.context = context;
    }

    @Override
    public void onCreate() { loadItems(); }

    @Override
    public void onDataSetChanged() { loadItems(); }

    private void loadItems() {
        items.clear();
        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        String raw = prefs.getString("widget_state", null);
        if (raw == null) return;
        try {
            JSONObject obj = new JSONObject(raw);
            JSONArray arr = obj.optJSONArray("items");
            if (arr == null) return;
            for (int i = 0; i < arr.length(); i++) {
                JSONObject it = arr.optJSONObject(i);
                if (it != null) items.add(it);
            }
        } catch (Exception ignored) {}
    }

    @Override
    public void onDestroy() { items.clear(); }

    @Override
    public int getCount() { return items.size(); }

    @Override
    public RemoteViews getViewAt(int position) {
        if (position >= items.size()) return null;
        JSONObject it = items.get(position);
        RemoteViews row = new RemoteViews(context.getPackageName(), R.layout.widget_item_row);

        row.setTextViewText(R.id.row_icon, it.optString("icon", ""));

        String time = it.optString("time", "");
        if (!time.isEmpty()) {
            row.setViewVisibility(R.id.row_time, android.view.View.VISIBLE);
            row.setTextViewText(R.id.row_time, time);
        } else {
            row.setViewVisibility(R.id.row_time, android.view.View.GONE);
        }

        row.setTextViewText(R.id.row_title, it.optString("title", ""));

        // Per-item accent color (defaults to lime if not provided)
        String accentHex = it.optString("accent", "#AAFF00");
        try {
            row.setInt(R.id.row_accent, "setBackgroundColor", Color.parseColor(accentHex));
        } catch (Exception ignored) {
            row.setInt(R.id.row_accent, "setBackgroundColor", Color.parseColor("#AAFF00"));
        }

        // Click intent — fill-in template set on the ListView in the widget
        String deepLink = it.optString("deepLink", "");
        if (!deepLink.isEmpty()) {
            Intent fillIn = new Intent();
            fillIn.setData(Uri.parse(deepLink));
            row.setOnClickFillInIntent(R.id.row_root, fillIn);
        }

        return row;
    }

    @Override
    public RemoteViews getLoadingView() { return null; }

    @Override
    public int getViewTypeCount() { return 1; }

    @Override
    public long getItemId(int position) { return position; }

    @Override
    public boolean hasStableIds() { return true; }
}
