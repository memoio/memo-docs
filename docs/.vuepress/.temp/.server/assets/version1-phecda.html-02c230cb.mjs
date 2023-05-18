import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper-cc2b3d55.mjs";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  _push(`<div${ssrRenderAttrs(_attrs)}><p>💻 Memo Phecda（TianJi）  </p><p>As the test network of Memo project, Phecda（TianJi） basically realizes the main functions of Memo, including the command line functions of Memo&#39;s three major roles (User/Keeper/Provider), s3 interface, etc. The MinIO Go Client SDK provides a simple API to access any object storage service compatible with Amazon S3. The memo provides an SDK based on MinIO.</p><p> </p><p>As the first version network of MEMO project, Phecda basically realizes the main functions of MEMO, including the command line functions of MEMO&#39;s three major roles (User/Keeper/Provider), s3 interface, etc.</p><ul><li>If you want more details, click here <a href="https://memolabs.medium.com/congratulations-on-provider-nodes-over-1000-and-user-registrations-over-7000-memo-testnet-phecda-81f23460c179" target="_blank" rel="noopener noreferrer">Congratulations on Provider nodes over 1000 and User registrations over 7000 — MEMO testnet Phecda test report`);
  _push(ssrRenderComponent(_component_ExternalLinkIcon, null, null, _parent));
  _push(`</a></li></ul><p> </p><p>❓The Overall Functions The overall functions that have been implemented for mefs-user, mefs-keeper, and mefs-provider will also be able to get a more complete experience in the test network Phecda（TianJi).</p><p> </p><p>Specifically, it includes: 📨 User&#39;s storage order matching, signing, uploading and downloading functions etc.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../pages/version-update-description/version1-phecda.html.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const version1Phecda_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__file", "version1-phecda.html.vue"]]);
export {
  version1Phecda_html as default
};
