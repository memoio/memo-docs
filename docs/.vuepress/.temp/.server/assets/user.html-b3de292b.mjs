import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper-cc2b3d55.mjs";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="user" tabindex="-1"><a class="header-anchor" href="#user" aria-hidden="true">#</a> User</h1><p> </p><h4 id="what-is-the-lfs-function-of-user" tabindex="-1"><a class="header-anchor" href="#what-is-the-lfs-function-of-user" aria-hidden="true">#</a> What is the LFS function of user?</h4><p>Mefs provides users with an encrypted file system LFS, which supports bucket and object operations</p><p> </p><h4 id="how-to-start-the-user-s-lfs" tabindex="-1"><a class="header-anchor" href="#how-to-start-the-user-s-lfs" aria-hidden="true">#</a> How To Start The User&#39;s LFS?</h4><p>After confirming that mefs-user daemon is running, and the running role is user, run mefs-user lfs start;</p><p>When the return value is returned, there will be information about the success or failure of the startup. The initial startup process includes the entire network query and contract signing, so the startup time is relatively long.</p><p>When the user starts lfs, he can choose to use the default parameters; if you lower the price parameter, you may not find enough providers;</p><p>If you increase the ks parameter, you may not find enough keepers; if you increase the ps parameter, you may not find enough providers.</p><p> </p><h4 id="what-are-the-lfs-initialization-errors-of-user" tabindex="-1"><a class="header-anchor" href="#what-are-the-lfs-initialization-errors-of-user" aria-hidden="true">#</a> What are the LFS initialization errors of user?</h4><p><strong>Input parameter error</strong></p><p>ps parameter setting should be greater than 1, other parameters should be greater than 0; rdo is true/false.</p><p><strong>Insufficient amount in user account</strong></p><p>The greater the storage duration and the storage size, the greater the amount required to sign the contract.</p><p> </p><h4 id="what-should-i-do-if-i-cannot-find-enough-number-of-keeper-provider-after-wrong-parameter-input" tabindex="-1"><a class="header-anchor" href="#what-should-i-do-if-i-cannot-find-enough-number-of-keeper-provider-after-wrong-parameter-input" aria-hidden="true">#</a> What should I do if I cannot find enough number of keeper/provider after wrong parameter input?</h4><p>Restart LFS, set new parameters, and set rdo to true.</p><p> </p><h4 id="what-are-the-common-mistakes-of-lfs-operation" tabindex="-1"><a class="header-anchor" href="#what-are-the-common-mistakes-of-lfs-operation" aria-hidden="true">#</a> What are the common mistakes of LFS operation?</h4><p><strong>When the bucket is created, the bucket already exists.</strong></p><p>This means that the bucket has been created with this name, and now the bucket is deleted, only marking records, not real deletion. Therefore, even if the bucket is deleted, creating it with this name again will still show that the bucket already exists.</p><p><strong>When downloading, it shows that the file already exists</strong></p><p>This is because the file already exists in the current directory, you can download it from another directory, or rename the file in the current directory.</p><p><strong>When uploading, it shows that the file already exists</strong></p><p>This means that there is already a file with this name in the currently uploaded bucket. Now that the file is deleted, it is only marked for recording, not a real deletion. So even if the file is deleted, creating it with this name again will still show that the file already exists. You can modify the upload path, for example, mefs-user lfs put_object objectName bucketName/, upload to the directory of &lt; new dir name &gt; corresponding to bucketName.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../pages/FAQ/user.html.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const user_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__file", "user.html.vue"]]);
export {
  user_html as default
};
