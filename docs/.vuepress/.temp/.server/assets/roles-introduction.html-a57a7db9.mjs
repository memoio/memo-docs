import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper-cc2b3d55.mjs";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="introduction-of-roles" tabindex="-1"><a class="header-anchor" href="#introduction-of-roles" aria-hidden="true">#</a> Introduction of Roles</h1><h2 id="the-planning-and-design-of-memo-system" tabindex="-1"><a class="header-anchor" href="#the-planning-and-design-of-memo-system" aria-hidden="true">#</a> The Planning and Design of Memo system</h2><h3 id="memo-s-original-design-intention" tabindex="-1"><a class="header-anchor" href="#memo-s-original-design-intention" aria-hidden="true">#</a> Memo&#39;s original design intention</h3><p>In the era of the information explosion that we are now in, tens of thousands of documents, photos, videos and other data files are generated every day in the world. However, traditional centralized storage methods have become increasingly unable to meet market demand. It is expensive, and the second reason is that the security is not high enough, so blockchain distributed storage came into being. Compared with traditional centralized storage, blockchain distributed storage is the use of idle electronic devices scattered around the world, such as idle mobile phones, computers, hard disks, etc., which can all be used as edge storage nodes. The typical characteristics of blockchain decentralized storage are decentralization , higher security, and low cost, which has attracted the attention of global capital and technology circles.</p><p>At present, the blockchain decentralized storage technology is still in the stage of continuous exploration. After continuous efforts, Memolab has developed a new generation of blockchain-based decentralized cloud storage system Memo. Compared with the traditional blockchain, Memo adopts a more concise and efficient technical processing method to protect the keeper, provider, and user information and data, thereby ensuring the cost-effectiveness of the entire storage system and enabling users to obtain better use Experience.</p><h3 id="system-requirements-what-problems-do-we-want-to-solve" tabindex="-1"><a class="header-anchor" href="#system-requirements-what-problems-do-we-want-to-solve" aria-hidden="true">#</a> System requirements-what problems do we want to solve?</h3><p>Since the distributed cloud storage system is deployed in a low-trust P2P network, there is no centralized third-party organization responsible for management, and the storage devices are mostly idle edge devices for users, not proprietary storage servers. Therefore, for this application scenario, the decentralized cloud storage management system first faces system management problems, which are divided into system role management, storage market management, data maintenance management, etc., and these management requirements are ultimately the use of smart contracts Therefore, the management problem of smart contracts must also be solved.</p><h4 id="_1-system-role-management-solve-the-problem-of-role-division" tabindex="-1"><a class="header-anchor" href="#_1-system-role-management-solve-the-problem-of-role-division" aria-hidden="true">#</a> 1.System role management-solve the problem of role division</h4><p>According to the needs of storage scenarios and functions, users in a distributed cloud storage system are divided into three categories. These three types of users are defined as user,provider, and keeper. Their functions in the system are as follows:</p><p><strong>User:</strong> Use storage space, specifically: upload data, which is stored by the storage node in the system, and is a consumer of storage services in the system.</p><p><strong>Keeper:</strong> responsible for information intermediary and management functions, specifically: collecting storage information provided by the Provider connected to it, such as a Provider providing 1T storage space; collecting the evaluation information of the Keeper connected to it, such as its integrity Degree, etc.; Find a Provider that meets the requirements according to the User’s storage requirements, and challenge the Provider.</p><p><strong>Provider:</strong> Provides storage space, specifically: Provides storage space for User, saves User&#39;s data, and is the provider of storage services in the system.</p><h4 id="_2-storage-market-management-solve-the-problem-of-how-to-implement-storage-services" tabindex="-1"><a class="header-anchor" href="#_2-storage-market-management-solve-the-problem-of-how-to-implement-storage-services" aria-hidden="true">#</a> 2.Storage market management-solve the problem of how to implement storage services</h4><p>The key application of Memo is storage service, so storage market management is essential. With the help of Keeper, User finds a suitable Provider. The Provider provides space and time for storing data. Keeper challenges the Provider that stores data on a regular basis. If a Provider challenge is found to fail, the data repair function needs to be triggered. Download from Provider when a user need data. According to this application scenario, the user needs to pay the storage fee and download the data fee to the Provider, and pay the coordination management fee to the Keeper.</p><p>If a user violates the storage rules, such as damaging data and refusing to repair, etc., a corresponding penalty mechanism is needed to maintain the normal operation of the system. How does Keeper match between User and Provider; how to pay according to the price after the storage service is established; how to solve the problem when faced with a user&#39;s request to download data. These problems are collectively referred to as the needs of storage market management, and Memo has designed a storage duration management solution for this purpose.</p><h4 id="_3-data-maintenance-management-solve-data-maintenance-problems" tabindex="-1"><a class="header-anchor" href="#_3-data-maintenance-management-solve-data-maintenance-problems" aria-hidden="true">#</a> 3.Data maintenance management-solve data maintenance problems</h4><p>Distributed cloud storage systems face the need for data maintenance and management. User’s data is stored on the selected Provider in the form of object storage, and the corresponding Keeper will challenge to ensure that the Keeper saves the data completely and correctly. However, this mechanism lacks trustworthiness, and all Keepers facing the same User may act dishonestly and provide false challenge results.</p><p>In addition, the user&#39;s metadata information is stored on the corresponding Keeper and synchronized between the Keepers. This can solve the problem of unbalanced or duplicated loads of metadata information in centralized cloud storage. Meta, the correctness of the data, and the maintenance of the data may be negotiated for evil. Therefore, based on the decentralization and trustworthiness of the smart contract, important information related to the stored data can be stored in the smart contract, so as to maintain the correctness of the data.</p><p>In order to maintain data security and integrity, various mainstream cryptographic technologies, such as symmetric encryption and decryption , anti-collision hash function and digital signature technology , are applied to meet strict data privacy and integrity requirements. Cryptography technology,data redundancy and repair technology will provide the system with sufficient flexibility to tolerate various possible software and hardware failures and small-scale malicious attacks, such as attempts to invade maintenance, storage and user equipment, thereby tampering, destroying, or Disclosure of data and information. At the same time, Memo uses proven POW and more innovative POS technology, supplemented by third-party security tools to further enhance system security.</p><h3 id="smart-contract-management-solve-the-problem-of-how-to-call-the-contract" tabindex="-1"><a class="header-anchor" href="#smart-contract-management-solve-the-problem-of-how-to-call-the-contract" aria-hidden="true">#</a> Smart contract management-solve the problem of how to call the contract</h3><p>One of the key issues in building a large-scale decentralized storage system is the efficient management of system roles and their relationships. In a distributed cloud storage system, according to different roles, the functions provided are different, and role information needs to be saved to determine the identity of the user to provide corresponding functions. The traditional method is to save the user&#39;s role, address and other information in the database, which is managed by the specific company. In the decentralized scenario, according to the characteristics of the account address that uniquely identifies users, smart contracts are used to manage system role information.</p><p>As mentioned above, the system has requirements for role management, storage market management, data maintenance and management, and these requirements ultimately need to be realized by smart contracts. Therefore, smart contract management is the basis for the realization of the above three types of management requirements. Contract management will The operation of the entire system runs through.</p><h3 id="how-to-call-the-smart-contract" tabindex="-1"><a class="header-anchor" href="#how-to-call-the-smart-contract" aria-hidden="true">#</a> How to call the smart contract?</h3><p>After the smart contract is deployed, the user needs to use the contract instance to be able to call the methods in the contract. The contract instance can be constructed by the contract address. For some contract functions that need to change the state on the chain, a specific user identity is required to be able to call; and for those contract functions that obtain the state information on the chain, any user can call. Therefore, the system has management problems such as storage and acquisition of contract addresses.</p><p>Figure: The interactive relationship between contract management and the system</p><p>In the Memo system, the account is first registered as a certain role, such as User. In this process, the address and User role of the account will be saved in the role smart contract. When the account is online, the role smart contract will be called. You can get your own role, and get the corresponding service according to the role. The account decides that it wants to become a certain role in the system based on its own storage requirements, conditions, etc. After the user goes online, the role information of the account is obtained from the role module.</p><p>Different roles have different functions, and role information also needs to be saved. The traditional approach is to save the user&#39;s role, address and other information in a central database, which is managed by a specific company. In the decentralized scenario of the Memo system, smart contracts will be used to manage system role information based on the characteristics of the account address that uniquely identifies users. In the initial stage of use, the Keeper of each user is randomly matched by the system. After the Keeper has accumulated certain data about the availability and reliability of the Provider, a scoring system can be built to match the Provider and the User, which can greatly reduce the transaction time.</p><p>Requirement analysis is the prerequisite for design and implementation. Based on the above management needs, Memo has designed multiple modules to solve the problems of role division, storage service implementation data maintenance, and contract invocation. These are the solid cornerstones of the Memo system.</p><h3 id="roles-design-of-memo-system" tabindex="-1"><a class="header-anchor" href="#roles-design-of-memo-system" aria-hidden="true">#</a> Roles Design of Memo System</h3><p>In the Memo distributed cloud storage system, each user can register a role according to his own needs. The system roles include User, Keeper, and Provider. If it is a storage demander, it is registered as a User; if it is a device provider, it is registered as a Provider; if it only provides information management services, it is registered as a Keeper. This article will explain the design principles of each role from the perspective of overall system operation.</p><p>The basic roles of the three parties are as follows:</p><p>1、User: is the consumer of the storage service in the system, puts forward storage requirements and uploads data</p><p>2、Keeper: It is the management coordinator in the system, responsible for information intermediary and management functions.</p><p>3、Provider: is the storage device provider in the system, providing storage space for users.</p><p>Among these three roles, User and Provider are the supply and demand parties of storage services, and User is also the end user in the system. In short, User uses storage space in the Memo system, Keeper finds a suitable storage node for User, and storage node Provider stores data for User. Keeper is equivalent to an intermediate information matchmaker, providing intermediary services for users and providers. We can understand Keeper as a headhunter on a recruitment platform or an intermediary in a real estate trading platform.</p><h3 id="role-conception" tabindex="-1"><a class="header-anchor" href="#role-conception" aria-hidden="true">#</a> Role conception</h3><h4 id="_1、user" tabindex="-1"><a class="header-anchor" href="#_1、user" aria-hidden="true">#</a> 1、User</h4><p>Since the end user in the system is the User, it needs to pay the corresponding storage fee for the storage service, so every service request is initiated by the User.</p><p>When the User proposes a storage service demand, it should include the following elements: storage space size, storage duration; the number of Providers and Keepers; and the required storage unit price.</p><p>Because only after setting the above parameters, Keeper can retrieve and match the corresponding storage node. At the same time, in a decentralized cloud storage system, the more storage nodes, the more secure the data, but the more storage nodes, the higher the payment fee. Therefore, the Users need to determine the number of storage node Providers and intermediate managers Keepers by themselves, and need to find a balance between cost and data security.</p><p>The Users not only need to pay for storage services, but when they need to download data from the Provider, they also need to pay for the download, because the download operation will bring the Provider and the consumption of traffic and equipment.</p><p>Since the User is the ultimate payer, the system does not set special restrictions for this role, because if the User does not pay, the Provider and Keeper will stop the service. But for the other two roles, Provider and Keeper, the system has set corresponding punishment measures for them, which will be discussed below.</p><h4 id="_2、keeper" tabindex="-1"><a class="header-anchor" href="#_2、keeper" aria-hidden="true">#</a> 2、Keeper</h4><h5 id="basic-functions" tabindex="-1"><a class="header-anchor" href="#basic-functions" aria-hidden="true">#</a> Basic functions</h5><p>Keeper is an important intermediate role in the system. It assumes information intermediary and management functions, and extracts management commissions from the storage fees paid by the User.</p><p>As an information intermediary, its basic function is to match information, that is, to match information between the demand-side and demand-supply side. When the User puts forward storage requirements, Keeper will find the Provider connected to itself according to the User&#39;s requirements, and match the appropriate storage node.</p><p>In addition to basic information matching, Keeper&#39;s management functions are mainly embodied in participating in challenges and triggering payments. Keeper regularly initiates and participates in challenges to Providers. Its purpose is to verify whether Providers store data completely, that is, to verify the authenticity and honesty of Providers. According to the challenge results, we can get how much and how long data each Provider has effectively stored for the User during this period of time, which will be used as the basis for the User&#39;s later payment.</p><p>In addition, another important function of Keeper is to trigger payment for storage fees. The payment is not triggered by the payer User or the payer Provider, but the payment is triggered by the middleman Keeper. This is mainly for the consideration of increasing the fairness of the system. Triggering by the middleman Keeper can reduce the probability of fraudulent behavior.</p><p>​ Figure: Basic functions of Keeper</p><h5 id="punishment-mechanism" tabindex="-1"><a class="header-anchor" href="#punishment-mechanism" aria-hidden="true">#</a> Punishment mechanism</h5><p>Keeper, as an intermediary, participates in the management of the system.Although it can solve the trust problem of the storage supply and demand of the distributed storage system to a certain extent, it is considered that Keeper itself may lack integrity, such as not challenging the storage of data on time and not on time. To trigger payment, Memo therefore designed punishment measures for the role. The existence of the punishment mechanism can ensure the good operation of the system and the healthy development of the community to a certain extent.</p><p>Therefore, the system stipulates that when the account is registered as a Keeper, a fee must be pledged. This fee can be refunded by the account, or it can be deducted when the account violates the system regulations. If the amount of the account pledge is insufficient, or there is no pledge deposit amount, then there is no good faith endorsement, the Keeper role of the account cannot be established.Regarding the amount of Keeper pledge, when to deduct the penalty and how much to deduct can be determined off-chain.</p><p>Usually, when an account severely violates the system regulations, a penalty will be given to the account. If a Keeper is unable to perform the space-time challenge of storing data on time, synchronize the result of the space-time challenge and report the result of the space-time challenge for a long time, then the system will ban the account. Once the account is banned, it will never become a Keeper again.</p><p>When Keeper is disabled, if the balance pledged by the Keeper is not 0, then the balance can be handled as follows: return to the account; transfer to the role manager who deploys the role contract; transfer to the Keeper who violates the system rules Other accounts affected include User, Keeper, and Provider.</p><p>Figure: Keeper&#39;s penalty mechanism</p><h4 id="_3、provider" tabindex="-1"><a class="header-anchor" href="#_3、provider" aria-hidden="true">#</a> 3、Provider</h4><h5 id="basic-functions-1" tabindex="-1"><a class="header-anchor" href="#basic-functions-1" aria-hidden="true">#</a> Basic functions</h5><p>Provider is the party that provides storage space in the system. It provides storage services for the Users and obtains fees paid by the Users. After the Provider goes online, you need to explain your storage situation, which should include the available storage space, storage duration, and required storage unit price. After the Provider explains its own situation, Keeper can match according to the situation of both the User and the Provider, and then send the matched Provider information to the User, so that the User, Keepers, and Providers form a storage service.</p><p>Like Keeper, Provider also has the function of triggering payment, except that Keeper triggers the payment of storage fees, while Provider triggers the payment of download fees. This is because the verification of storage fees requires the participation of the intermediate manager Keeper, while the download fee is Verification does not require the participation of intermediate managers.</p><h5 id="punishment-mechanism-1" tabindex="-1"><a class="header-anchor" href="#punishment-mechanism-1" aria-hidden="true">#</a> Punishment mechanism</h5><p>The penalties for breach of the Keeper mentioned above. For Provider, the system also designs rewards and punishments, because the Provider may have problems such as corrupted data but not recovering, long-term failure to respond to User download data requests or Keeper challenges.This will not only destroy the User&#39;s data, but also seriously affect the user experience.</p><p>Therefore, for the Provider role, it is also necessary to pledge a fee when applying for the role. Once the Provider violates the system rules, the system will trigger the corresponding penalty to deduct the pledge deposit amount.</p><h5 id="penalty-contract-deployer-third-party-contract-manager-admin" tabindex="-1"><a class="header-anchor" href="#penalty-contract-deployer-third-party-contract-manager-admin" aria-hidden="true">#</a> Penalty contract deployer:third-party contract manager Admin</h5><p>From the perspective of system design, each role can gain something in the Memo system. Since User is the ultimate consumer, and the punishment measures are mainly for the collection role, that is, for Keeper and Provider, the realization of system role functions and the interaction between roles are realized through smart contracts, so the punishment is also realized by smart contracts. of.</p><p>The reason for adopting the contract-based penalty mechanism is: a decentralized system deployed in a low-credibility environment, there is no specific organizational decision, implementation of rewards and punishments, and the contract has all the terms and execution processes that are formulated in advance and are The advantage of being carried out under the absolute control of the computer. In addition, after the smart contract is compiled, it is deployed on the blockchain and executed by the virtual machine, and every node on the blockchain will run the process of the smart contract, so the execution process and execution of the smart contract can be realized that the result is distributed supervision and arbitration.</p><p>With the help of these advantages of smart contracts, the penalty mechanism for Provider and Keeper can be specified in the contract in advance. For the problem of who triggers the pledge deduction function of smart contracts, the available solutions are: triggered by User; triggered by Keeper; triggered by other Providers; or triggered by the role contract <a href="http://deployer.It" target="_blank" rel="noopener noreferrer">deployer.It`);
  _push(ssrRenderComponent(_component_ExternalLinkIcon, null, null, _parent));
  _push(`</a> is inappropriate for any role in the system to trigger the deduction of the pledge function of Provider and Keeper. The reason is that the three of them are related to each other in a storage service.Provider obtains revenue by storing data for User, and Keeper obtains revenue by helping User challenge verification data and collect information.Therefore, the power to trigger the deduction of pledge function should be transferred to an unrelated third party, that is, the role contract deployer, here called the contract manager Admin. The Admin deploys the penalty contract, which is also one of the checks and balances designed by the Memo system to achieve fair transactions.</p><h5 id="node-matching-of-memo-system" tabindex="-1"><a class="header-anchor" href="#node-matching-of-memo-system" aria-hidden="true">#</a> Node matching of Memo System</h5><p>The core application of the Memo system is a decentralized blockchain. In order to achieve fair transactions in a low-credibility environment, the system has designed corresponding functions for each role, storage demander (User), storage coordinator (Keeper), storage provider（Provider） providers interact with each other to form a system ecosystem. This article will elaborate on the node matching of the Memo system, that is, how does the User find a Provider that provides storage services for himself?</p><h5 id="user-s-demand-parameter-setting" tabindex="-1"><a class="header-anchor" href="#user-s-demand-parameter-setting" aria-hidden="true">#</a> User&#39;s demand parameter setting</h5><p>User is the final consumer of the system. Every storage service is initiated by User, and then Keeper and Provider provide services for it. In the role design article, we have mentioned that when the User proposes storage service requirements, the following elements should be included: storage space size, storage duration, and the number of providers and keepers.</p><p>Storage space size and storage duration are the most basic parameters. As for why the number of Providers and Keepers should be selected, it is because the Memo system uses object storage, and the off-chain maintenance of data uses data redundancy: multiple copies or corrections. Delete codes, so the more storage nodes, the safer the data.Because once the data on a storage node is lost, other storage nodes can help restore its data. In this decentralized cloud storage system, the more storage nodes there are, the smaller the probability of data damage or loss in all storage nodes.But the more storage nodes you choose, the higher the User&#39;s payment for storage services. Therefore, the User&#39;s requirements for storage services should also include the number of Providers. The User measures the cost and data security issues, and determines the number of storage node Providers.</p><p>Similarly, because Keeper needs to challenge the Provider in time and space, that is, through data verification technology, to check how much data the Provider correctly stores and the storage duration, multiple Keepers agree on the challenge result, and the consensus result serves as the basis for paying for the Provider&#39;s stored data.The number of Keepers will affect this storage service. The reason is: the more Keepers, the higher the cost of falsifying the challenge results, and the lower the probability that all Keepers are offline.</p><h5 id="user-s-other-parameter-settings-reputation-value-price" tabindex="-1"><a class="header-anchor" href="#user-s-other-parameter-settings-reputation-value-price" aria-hidden="true">#</a> User&#39;s other parameter settings: reputation value, price</h5><p>When the User proposes storage requirements, in addition to the basic parameters of storage space, storage duration, and the number of Providers and Keepers, some other parameters may also be set according to specific usage scenarios.</p><p>Because the integrity of each Provider may be different, some Providers can guarantee the normal storage of data every time and can be online for a long time, while some Providers cannot.Therefore, the reputation value of the Provider can also be selected according to the needs, which is derived from the performance of the Provider’s historical service.When Provide guarantees long-term online and normally stores data for User and actively responds to the challenge of Keeper, its reputation value will be higher. The higher the reputation, the greater the chance of matching with User in the future.</p><p>Similarly, for Keeper, in addition to the quantity requirements, the reputation value will also be involved. The User can also request the Keeper&#39;s reputation value when setting the parameters, because every consumer wants to cooperate with a partner with a high reputation.</p><p>In addition, the system should provide the Users with the function of specifying the price of storage services, such as how much money needs to be paid for each day of storage of 1MB of data. The specific storage unit price can be determined according to the actual use of the system.</p><p>In summary, the parameters that Users need to specify when seeking storage services include storage space size, storage duration, storage unit price, Keeper parameter requirements (such as the number of Keepers), and Provider parameter requirements (such as the number of Providers).</p><p>Figure: User&#39;s demand parameters</p><h5 id="smart-contract-matching" tabindex="-1"><a class="header-anchor" href="#smart-contract-matching" aria-hidden="true">#</a> Smart contract matching</h5><p>After the User sets the required parameters, Keeper will find the Provider connected to it according to the User&#39;s storage service requirements, and match the appropriate storage node.The specific situation of the matching operation is: after the Provider goes online, explain your own storage situation,which should include: available storage space, storage duration, and required storage unit price.Therefore, Keeper matches according to the situation of both parties, and then sends the matched Provider information to the User. Thus, User, Keepers, and Providers form a storage service.</p><p>For the problem of how Keeper matches according to the storage conditions of User and Provider, the first solution is:when the node is connected, User and Provider actively send their own storage service related information to Keeper; the second solution is: use smart contracts to record User’s storage requirements and Provider’s storage conditions on the chain. When connected to Keeper, Keeper directly receives View on the chain to match.Compared with the two solution, the first solution will increase the burden on the system network and lack of reviewability for subsequent storage services.The second solution records information in a smart contract, which has the characteristics of distributed supervision and non-tampering, and only Keeper querying information from the chain will not cause a network burden greater than that of the first solution, and it is also convenient for auditing, but the user and the provider need to bear the deployment of intelligence the cost of the contract.</p><p>Figure: Smart contract matching</p><p>Therefore, various parameter information related to the storage service will be recorded through the smart contract, including the User&#39;s demand parameters for the storage service and the storage service related parameters that the Provider can <a href="http://provide.It" target="_blank" rel="noopener noreferrer">provide.It`);
  _push(ssrRenderComponent(_component_ExternalLinkIcon, null, null, _parent));
  _push(`</a> can be said that smart contracts run through the Memo system.</p><p> </p><h2 id="how-do-the-three-roles-in-memo-work" tabindex="-1"><a class="header-anchor" href="#how-do-the-three-roles-in-memo-work" aria-hidden="true">#</a> How Do the Three Roles in MEMO Work?</h2><p>User puts forward storage requirements and pays for storage services; Keeper matches information between User and Provider, challenges Provider to verify its normal work, and obtains commission from User; Provider provides storage space, participates in the challenge, and obtains storage fee from User.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../pages/concepts/roles-introduction.html.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const rolesIntroduction_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__file", "roles-introduction.html.vue"]]);
export {
  rolesIntroduction_html as default
};
