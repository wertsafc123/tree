import Vue from 'vue';
import VueI18n from 'vue-i18n';
import config from '../config';

Vue.use(VueI18n);

function loadLocaleMessages() {
  const locales = require.context('./lang', true, /[A-Za-z0-9-_,\s]+\.js$/i);
  const messages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key).default;
    }
  });
  return messages;
}

const { locale } = config;

const vueI18n = new VueI18n({
  locale,
  // fallbackLocale: locale,
  messages: loadLocaleMessages(),
});
export default vueI18n;
