package com.gsd.app;

import android.content.Intent;
import android.widget.RemoteViewsService;

public class WidgetItemsService extends RemoteViewsService {
    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        return new WidgetItemsFactory(getApplicationContext());
    }
}
