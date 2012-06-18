var WhiteTheme = function(name, id) {
  this.name = name;
  this.id = id || 'ace/theme/' + name.toLowerCase().replace(/\s/g, '_');
  this.cls = 'ace-theme-white';
};

var BlackTheme = function(name, id) {
  WhiteTheme.call(this, name, id);
  this.cls = 'ace-theme-black';
};


TD.service('settings', function($rootScope, storage, log, VimHandler, EmacsHandler) {
  var settings = this;

  this.THEMES = [
    new WhiteTheme('Chrome'),
    new WhiteTheme('Clouds'),
    new BlackTheme('Clouds Midnight'),
    new BlackTheme('Cobalt'),
    new WhiteTheme('Crimson Editor'),
    new WhiteTheme('Dawn'),
    new WhiteTheme('Dreamweaver'),
    new WhiteTheme('Eclipse'),
    new BlackTheme('idleFingers', 'ace/theme/idle_fingers'),
    new BlackTheme('krTheme', 'ace/theme/kr_theme'),
    new BlackTheme('Merbivore'),
    new BlackTheme('Merbivore Soft'),
    new BlackTheme('Mono Industrial'),
    new BlackTheme('Monokai'),
    new BlackTheme('Pastel on dark'),
    new BlackTheme('Solarized Dark'),
    new WhiteTheme('Solarized Light'),
    new WhiteTheme('TextMate'),
    new BlackTheme('Twilight'),
    new WhiteTheme('Tomorrow'),
    new BlackTheme('Tomorrow Night'),
    new BlackTheme('Tomorrow Night Blue'),
    new BlackTheme('Tomorrow Night Bright'),
    new BlackTheme('Tomorrow Night 80s', 'ace/theme/tomorrow_night_eighties'),
    new BlackTheme('Vibrant Ink')
  ];

  this.KEY_MODES = [
    {name: 'ACE', id: 'ace', handler: null},
    {name: 'Vim', id: 'vim', handler: VimHandler},
    {name: 'Emacs', id: 'emacs', handler: EmacsHandler}
  ];

  this.SOFT_WRAP = [
    {name: 'None', value: -1},
    {name: 'Window Width', value: 0},
    {name: '80', value: 80},
    {name: '100', value: 100}
  ];

  var findById = function(collection, id) {
    for (var i = 0; i < collection.length; i++) {
      if (collection[i].id === id) {
        return collection[i];
      }
    }
  };

  var data = {};
  var listeners = {};


  var defineProperty = function(name) {
    settings.__defineGetter__(name, function() {
      return data[name];
    });

    settings.__defineSetter__(name, function(value) {
      data[name] = value;

      if (!listeners[name]) {
        return;
      }

      listeners[name].forEach(function(fn) {
        fn(value);
      });
    });
  };

  defineProperty('theme');
  defineProperty('keyMode');
  defineProperty('useSoftTabs');
  defineProperty('tabSize');
  defineProperty('softWrap');
  defineProperty('maxOpenTabs');

  this.on = function(name, fn) {
    if (!listeners[name]) {
      listeners[name] = [];
    }

    listeners[name].push(fn);
  };

  this.store = function() {
    storage.set({
      settings: {
        theme: data.theme && data.theme.id,
        keyMode: data.keyMode && data.keyMode.id,
        useSoftTabs: data.useSoftTabs,
        tabSize: data.tabSize,
        softWrap: data.softWrap,
        maxOpenTabs: data.maxOpenTabs
      }
    }, function() {
      log('settings saved');
    });
  };

  this.load = function() {
    storage.get(['settings'], function(data) {
      data = data.settings || {};

      if (data.theme) {
        settings.theme = findById(settings.THEMES, data.theme);
        log('loaded theme', settings.theme.id);
      } else {
        settings.theme = findById(settings.THEMES, 'ace/theme/monokai');
        log('default theme', settings.theme.id);
      }

      if (data.keyMode) {
        settings.keyMode = findById(settings.KEY_MODES, data.keyMode);
        log('loaded keyMode', settings.keyMode.id);
      } else {
        settings.keyMode = findById(settings.KEY_MODES, 'ace');
        log('default keyMode', settings.keyMode.id);
      }

      if (angular.isDefined(data.useSoftTabs)) {
        settings.useSoftTabs = data.useSoftTabs;
        log('loaded useSoftTabs', settings.useSoftTabs);
      } else {
        settings.useSoftTabs = true;
        log('default useSoftTabs', settings.useSoftTabs);
      }

      if (angular.isDefined(data.tabSize)) {
        settings.tabSize = data.tabSize;
        log('loaded tabSize', settings.tabSize);
      } else {
        settings.tabSize = 4;
        log('default tabSize', settings.tabSize);
      }

      if (angular.isDefined(data.softWrap)) {
        settings.softWrap = data.softWrap;
        log('loaded softWrap', settings.softWrap);
      } else {
        settings.softWrap = 0;
        log('default softWrap', settings.softWrap);
      }

      if (angular.isDefined(data.maxOpenTabs)) {
        settings.maxOpenTabs = data.maxOpenTabs;
        log('loaded maxOpenTabs', settings.maxOpenTabs);
      } else {
        settings.maxOpenTabs = 10;
        log('default maxOpenTabs', settings.maxOpenTabs);
      }
    });
  };
});
