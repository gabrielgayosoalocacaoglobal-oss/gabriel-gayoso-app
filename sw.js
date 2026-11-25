// Service worker: permite instalar o app no celular e recebe os lembretes por push.
// Não guarda nada em cache: os dados vêm sempre do banco, e a interface sempre da versão mais recente publicada.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});

// Lembrete chegou (15 minutos antes de um bloco, evento ou tarefa)
self.addEventListener("push", (e) => {
  let m = {};
  try {
    m = e.data ? e.data.json() : {};
  } catch {
    m = { titulo: "Gabriel Gayoso", corpo: e.data ? e.data.text() : "" };
  }
  const base = self.registration.scope;
  e.waitUntil(
    self.registration.showNotification(m.titulo || "Gabriel Gayoso", {
      body: m.corpo || "",
      tag: m.tag || undefined, // mesma tag substitui, não duplica
      icon: base + "icon-192.png",
      badge: base + "icon-192.png",
      data: { url: m.url || base + "dashboard" },
    }),
  );
});

// Toque na notificação: abre (ou traz para a frente) o app no Dashboard
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((lista) => {
      for (const c of lista) if ("focus" in c) return c.navigate(url).then((x) => (x || c).focus());
      return self.clients.openWindow(url);
    }),
  );
});
