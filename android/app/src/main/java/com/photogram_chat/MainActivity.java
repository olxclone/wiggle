package com.photogram_chat;
import android.os.Bundle;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "photogram_chat";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
  super.onCreate(null);
}
}
