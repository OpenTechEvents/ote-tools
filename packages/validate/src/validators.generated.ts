// GENERATED FILE — DO NOT EDIT.
// Vendored verbatim from @opentechevents/schema's index.js (its version is
// pinned in package.json) — see scripts/embed-schemas.mjs for why this is
// vendored source, not a live runtime import or a JSON embed.
// Regenerate with: pnpm gen
// Guard tests (test/validators-generated.test.ts) fail if this drifts.
// @ts-nocheck -- vendored plain JS, not authored/typed here.

export const annotationKeywords = [
  { keyword: "x-inheritsFrom", metaSchema: { type: "string" } },
];

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

const WALL_CLOCK = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

/**
 * `$defs.dateTime`'s own concept — a wall-clock date-time, deliberately without an offset and
 * without seconds (this is the hour on a poster, never a technical instant) — has no standard
 * RFC 3339 format, so ajv-formats cannot validate it. Checks real calendar validity (days per
 * month, leap years) the same way ajv-formats' own `date` format does internally.
 */
function isOteLocalDateTime(value) {
  const match = WALL_CLOCK.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  if (month < 1 || month > 12) return false;
  const maxDay = month === 2 && isLeapYear(year) ? 29 : DAYS_IN_MONTH[month - 1];
  return day >= 1 && day <= maxDay && hour <= 23 && minute <= 59;
}

const languageSubtags = {"source":"https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry","fileDate":"2026-06-14","language":["aa","aaa","aab","aac","aad","aae","aaf","aag","aah","aai","aak","aal","aam","aan","aao","aap","aaq","aas","aat","aau","aav","aaw","aax","aaz","ab","aba","abb","abc","abd","abe","abf","abg","abh","abi","abj","abl","abm","abn","abo","abp","abq","abr","abs","abt","abu","abv","abw","abx","aby","abz","aca","acb","acd","ace","acf","ach","aci","ack","acl","acm","acn","acp","acq","acr","acs","act","acu","acv","acw","acx","acy","acz","ada","adb","add","ade","adf","adg","adh","adi","adj","adl","adn","ado","adp","adq","adr","ads","adt","adu","adw","adx","ady","adz","ae","aea","aeb","aec","aed","aee","aek","ael","aem","aen","aeq","aer","aes","aeu","aew","aey","aez","af","afa","afb","afd","afe","afg","afh","afi","afk","afn","afo","afp","afs","aft","afu","afz","aga","agb","agc","agd","age","agf","agg","agh","agi","agj","agk","agl","agm","agn","ago","agp","agq","agr","ags","agt","agu","agv","agw","agx","agy","agz","aha","ahb","ahg","ahh","ahi","ahk","ahl","ahm","ahn","aho","ahp","ahr","ahs","aht","aia","aib","aic","aid","aie","aif","aig","aih","aii","aij","aik","ail","aim","ain","aio","aip","aiq","air","ais","ait","aiw","aix","aiy","aja","ajg","aji","ajn","ajp","ajs","ajt","aju","ajw","ajz","ak","akb","akc","akd","ake","akf","akg","akh","aki","akj","akk","akl","akm","ako","akp","akq","akr","aks","akt","aku","akv","akw","akx","aky","akz","ala","alc","ald","ale","alf","alg","alh","ali","alj","alk","all","alm","aln","alo","alp","alq","alr","als","alt","alu","alv","alw","alx","aly","alz","am","ama","amb","amc","ame","amf","amg","ami","amj","amk","aml","amm","amn","amo","amp","amq","amr","ams","amt","amu","amv","amw","amx","amy","amz","an","ana","anb","anc","and","ane","anf","ang","anh","ani","anj","ank","anl","anm","ann","ano","anp","anq","anr","ans","ant","anu","anv","anw","anx","any","anz","aoa","aob","aoc","aod","aoe","aof","aog","aoh","aoi","aoj","aok","aol","aom","aon","aor","aos","aot","aou","aox","aoz","apa","apb","apc","apd","ape","apf","apg","aph","api","apj","apk","apl","apm","apn","apo","app","apq","apr","aps","apt","apu","apv","apw","apx","apy","apz","aqa","aqc","aqd","aqg","aqk","aql","aqm","aqn","aqp","aqr","aqt","aqz","ar","arb","arc","ard","are","arh","ari","arj","ark","arl","arn","aro","arp","arq","arr","ars","art","aru","arv","arw","arx","ary","arz","as","asa","asb","asc","asd","ase","asf","asg","ash","asi","asj","ask","asl","asn","aso","asp","asq","asr","ass","ast","asu","asv","asw","asx","asy","asz","ata","atb","atc","atd","ate","atg","ath","ati","atj","atk","atl","atm","atn","ato","atp","atq","atr","ats","att","atu","atv","atw","atx","aty","atz","aua","aub","auc","aud","aue","auf","aug","auh","aui","auj","auk","aul","aum","aun","auo","aup","auq","aur","aus","aut","auu","auw","aux","auy","auz","av","avb","avd","avi","avk","avl","avm","avn","avo","avs","avt","avu","avv","awa","awb","awc","awd","awe","awg","awh","awi","awk","awm","awn","awo","awr","aws","awt","awu","awv","aww","awx","awy","axb","axe","axg","axk","axl","axm","axx","ay","aya","ayb","ayc","ayd","aye","ayg","ayh","ayi","ayk","ayl","ayn","ayo","ayp","ayq","ayr","ays","ayt","ayu","ayx","ayy","ayz","az","aza","azb","azc","azd","azg","azj","azm","azn","azo","azt","azz","ba","baa","bab","bac","bad","bae","baf","bag","bah","bai","baj","bal","ban","bao","bap","bar","bas","bat","bau","bav","baw","bax","bay","baz","bba","bbb","bbc","bbd","bbe","bbf","bbg","bbh","bbi","bbj","bbk","bbl","bbm","bbn","bbo","bbp","bbq","bbr","bbs","bbt","bbu","bbv","bbw","bbx","bby","bbz","bca","bcb","bcc","bcd","bce","bcf","bcg","bch","bci","bcj","bck","bcl","bcm","bcn","bco","bcp","bcq","bcr","bcs","bct","bcu","bcv","bcw","bcy","bcz","bda","bdb","bdc","bdd","bde","bdf","bdg","bdh","bdi","bdj","bdk","bdl","bdm","bdn","bdo","bdp","bdq","bdr","bds","bdt","bdu","bdv","bdw","bdx","bdy","bdz","be","bea","beb","bec","bed","bee","bef","beg","beh","bei","bej","bek","bem","beo","bep","beq","ber","bes","bet","beu","bev","bew","bex","bey","bez","bfa","bfb","bfc","bfd","bfe","bff","bfg","bfh","bfi","bfj","bfk","bfl","bfm","bfn","bfo","bfp","bfq","bfr","bfs","bft","bfu","bfw","bfx","bfy","bfz","bg","bga","bgb","bgc","bgd","bge","bgf","bgg","bgi","bgj","bgk","bgl","bgm","bgn","bgo","bgp","bgq","bgr","bgs","bgt","bgu","bgv","bgw","bgx","bgy","bgz","bh","bha","bhb","bhc","bhd","bhe","bhf","bhg","bhh","bhi","bhj","bhk","bhl","bhm","bhn","bho","bhp","bhq","bhr","bhs","bht","bhu","bhv","bhw","bhx","bhy","bhz","bi","bia","bib","bic","bid","bie","bif","big","bih","bij","bik","bil","bim","bin","bio","bip","biq","bir","bit","biu","biv","biw","bix","biy","biz","bja","bjb","bjc","bjd","bje","bjf","bjg","bjh","bji","bjj","bjk","bjl","bjm","bjn","bjo","bjp","bjq","bjr","bjs","bjt","bju","bjv","bjw","bjx","bjy","bjz","bka","bkb","bkc","bkd","bkf","bkg","bkh","bki","bkj","bkk","bkl","bkm","bkn","bko","bkp","bkq","bkr","bks","bkt","bku","bkv","bkw","bkx","bky","bkz","bla","blb","blc","bld","ble","blf","blg","blh","bli","blj","blk","bll","blm","bln","blo","blp","blq","blr","bls","blt","blv","blw","blx","bly","blz","bm","bma","bmb","bmc","bmd","bme","bmf","bmg","bmh","bmi","bmj","bmk","bml","bmm","bmn","bmo","bmp","bmq","bmr","bms","bmt","bmu","bmv","bmw","bmx","bmy","bmz","bn","bna","bnb","bnc","bnd","bne","bnf","bng","bni","bnj","bnk","bnl","bnm","bnn","bno","bnp","bnq","bnr","bns","bnt","bnu","bnv","bnw","bnx","bny","bnz","bo","boa","bob","boe","bof","bog","boh","boi","boj","bok","bol","bom","bon","boo","bop","boq","bor","bot","bou","bov","bow","box","boy","boz","bpa","bpb","bpc","bpd","bpe","bpg","bph","bpi","bpj","bpk","bpl","bpm","bpn","bpo","bpp","bpq","bpr","bps","bpt","bpu","bpv","bpw","bpx","bpy","bpz","bqa","bqb","bqc","bqd","bqf","bqg","bqh","bqi","bqj","bqk","bql","bqm","bqn","bqo","bqp","bqq","bqr","bqs","bqt","bqu","bqv","bqw","bqx","bqy","bqz","br","bra","brb","brc","brd","brf","brg","brh","bri","brj","brk","brl","brm","brn","bro","brp","brq","brr","brs","brt","bru","brv","brw","brx","bry","brz","bs","bsa","bsb","bsc","bse","bsf","bsg","bsh","bsi","bsj","bsk","bsl","bsm","bsn","bso","bsp","bsq","bsr","bss","bst","bsu","bsv","bsw","bsx","bsy","bta","btb","btc","btd","bte","btf","btg","bth","bti","btj","btk","btl","btm","btn","bto","btp","btq","btr","bts","btt","btu","btv","btw","btx","bty","btz","bua","bub","buc","bud","bue","buf","bug","buh","bui","buj","buk","bum","bun","buo","bup","buq","bus","but","buu","buv","buw","bux","buy","buz","bva","bvb","bvc","bvd","bve","bvf","bvg","bvh","bvi","bvj","bvk","bvl","bvm","bvn","bvo","bvp","bvq","bvr","bvt","bvu","bvv","bvw","bvx","bvy","bvz","bwa","bwb","bwc","bwd","bwe","bwf","bwg","bwh","bwi","bwj","bwk","bwl","bwm","bwn","bwo","bwp","bwq","bwr","bws","bwt","bwu","bww","bwx","bwy","bwz","bxa","bxb","bxc","bxd","bxe","bxf","bxg","bxh","bxi","bxj","bxk","bxl","bxm","bxn","bxo","bxp","bxq","bxr","bxs","bxu","bxv","bxw","bxx","bxz","bya","byb","byc","byd","bye","byf","byg","byh","byi","byj","byk","byl","bym","byn","byo","byp","byq","byr","bys","byt","byv","byw","byx","byy","byz","bza","bzb","bzc","bzd","bze","bzf","bzg","bzh","bzi","bzj","bzk","bzl","bzm","bzn","bzo","bzp","bzq","bzr","bzs","bzt","bzu","bzv","bzw","bzx","bzy","bzz","ca","caa","cab","cac","cad","cae","caf","cag","cah","cai","caj","cak","cal","cam","can","cao","cap","caq","car","cas","cau","cav","caw","cax","cay","caz","cba","cbb","cbc","cbd","cbe","cbg","cbh","cbi","cbj","cbk","cbl","cbn","cbo","cbq","cbr","cbs","cbt","cbu","cbv","cbw","cby","cca","ccc","ccd","cce","ccg","cch","ccj","ccl","ccm","ccn","cco","ccp","ccq","ccr","ccs","cda","cdc","cdd","cde","cdf","cdg","cdh","cdi","cdj","cdm","cdn","cdo","cdr","cds","cdy","cdz","ce","cea","ceb","ceg","cek","cel","cen","cet","cey","cfa","cfd","cfg","cfm","cga","cgc","cgg","cgk","ch","chb","chc","chd","chf","chg","chh","chj","chk","chl","chm","chn","cho","chp","chq","chr","cht","chw","chx","chy","chz","cia","cib","cic","cid","cie","cih","cik","cim","cin","cip","cir","ciw","ciy","cja","cje","cjh","cji","cjk","cjm","cjn","cjo","cjp","cjr","cjs","cjv","cjy","cka","ckb","ckh","ckl","ckm","ckn","cko","ckq","ckr","cks","ckt","cku","ckv","ckx","cky","ckz","cla","clc","cld","cle","clh","cli","clj","clk","cll","clm","clo","cls","clt","clu","clw","cly","cma","cmc","cme","cmg","cmi","cmk","cml","cmm","cmn","cmo","cmr","cms","cmt","cna","cnb","cnc","cng","cnh","cni","cnk","cnl","cno","cnp","cnq","cnr","cns","cnt","cnu","cnw","cnx","co","coa","cob","coc","cod","coe","cof","cog","coh","coj","cok","col","com","con","coo","cop","coq","cot","cou","cov","cow","cox","coy","coz","cpa","cpb","cpc","cpe","cpf","cpg","cpi","cpn","cpo","cpp","cps","cpu","cpx","cpy","cqd","cqu","cr","cra","crb","crc","crd","crf","crg","crh","cri","crj","crk","crl","crm","crn","cro","crp","crq","crr","crs","crt","crv","crw","crx","cry","crz","cs","csa","csb","csc","csd","cse","csf","csg","csh","csi","csj","csk","csl","csm","csn","cso","csp","csq","csr","css","cst","csu","csv","csw","csx","csy","csz","cta","ctc","ctd","cte","ctg","cth","ctl","ctm","ctn","cto","ctp","cts","ctt","ctu","cty","ctz","cu","cua","cub","cuc","cug","cuh","cui","cuj","cuk","cul","cum","cuo","cup","cuq","cur","cus","cut","cuu","cuv","cuw","cux","cuy","cv","cvg","cvn","cwa","cwb","cwd","cwe","cwg","cwt","cxh","cy","cya","cyb","cyo","czh","czk","czn","czo","czt","da","daa","dac","dad","dae","daf","dag","dah","dai","daj","dak","dal","dam","dao","dap","daq","dar","das","dau","dav","daw","dax","day","daz","dba","dbb","dbd","dbe","dbf","dbg","dbi","dbj","dbl","dbm","dbn","dbo","dbp","dbq","dbr","dbt","dbu","dbv","dbw","dby","dcc","dcr","dda","ddd","dde","ddg","ddi","ddj","ddn","ddo","ddr","dds","ddw","de","dec","ded","dee","def","deg","deh","dei","dek","del","dem","den","dep","deq","der","des","dev","dez","dga","dgb","dgc","dgd","dge","dgg","dgh","dgi","dgk","dgl","dgn","dgo","dgr","dgs","dgt","dgu","dgw","dgx","dgz","dha","dhd","dhg","dhi","dhl","dhm","dhn","dho","dhr","dhs","dhu","dhv","dhw","dhx","dia","dib","dic","did","dif","dig","dih","dii","dij","dik","dil","dim","din","dio","dip","diq","dir","dis","dit","diu","diw","dix","diy","diz","dja","djb","djc","djd","dje","djf","dji","djj","djk","djl","djm","djn","djo","djr","dju","djw","dka","dkg","dkk","dkl","dkr","dks","dkx","dlg","dlk","dlm","dln","dma","dmb","dmc","dmd","dme","dmf","dmg","dmk","dml","dmm","dmn","dmo","dmr","dms","dmu","dmv","dmw","dmx","dmy","dna","dnd","dne","dng","dni","dnj","dnk","dnn","dno","dnr","dnt","dnu","dnv","dnw","dny","doa","dob","doc","doe","dof","doh","doi","dok","dol","don","doo","dop","doq","dor","dos","dot","dov","dow","dox","doy","doz","dpp","dra","drb","drc","drd","dre","drg","drh","dri","drl","drn","dro","drq","drr","drs","drt","dru","drw","dry","dsb","dse","dsh","dsi","dsk","dsl","dsn","dso","dsq","dsz","dta","dtb","dtd","dth","dti","dtk","dtm","dtn","dto","dtp","dtr","dts","dtt","dtu","dty","dua","dub","duc","dud","due","duf","dug","duh","dui","duj","duk","dul","dum","dun","duo","dup","duq","dur","dus","duu","duv","duw","dux","duy","duz","dv","dva","dwa","dwk","dwl","dwr","dws","dwu","dww","dwy","dwz","dya","dyb","dyd","dyg","dyi","dyl","dym","dyn","dyo","dyr","dyu","dyy","dz","dza","dzd","dze","dzg","dzl","dzn","eaa","ebc","ebg","ebk","ebo","ebr","ebu","ecr","ecs","ecy","ee","eee","efa","efe","efi","ega","egl","egm","ego","egx","egy","ehs","ehu","eip","eit","eiv","eja","eka","ekc","eke","ekg","eki","ekk","ekl","ekm","eko","ekp","ekr","eky","el","ele","elh","eli","elk","elm","elo","elp","elu","elx","ema","emb","eme","emg","emi","emk","emm","emn","emo","emp","emq","ems","emu","emw","emx","emy","emz","en","ena","enb","enc","end","enf","enh","enl","enm","enn","eno","enq","enr","enu","env","enw","enx","eo","eot","epi","era","erg","erh","eri","erk","ero","err","ers","ert","erw","es","ese","esg","esh","esi","esk","esl","esm","esn","eso","esq","ess","esu","esx","esy","et","etb","etc","eth","etn","eto","etr","ets","ett","etu","etx","etz","eu","eud","euq","eve","evh","evn","ewo","ext","eya","eyo","eza","eze","fa","faa","fab","fad","faf","fag","fah","fai","faj","fak","fal","fam","fan","fap","far","fat","fau","fax","fay","faz","fbl","fcs","fer","ff","ffi","ffm","fgr","fi","fia","fie","fif","fil","fip","fir","fit","fiu","fiw","fj","fkk","fkv","fla","flh","fli","fll","fln","flr","fly","fmp","fmu","fnb","fng","fni","fo","fod","foi","fom","fon","for","fos","fox","fpe","fqs","fr","frc","frd","frk","frm","fro","frp","frq","frr","frs","frt","fse","fsl","fss","fub","fuc","fud","fue","fuf","fuh","fui","fuj","fum","fun","fuq","fur","fut","fuu","fuv","fuy","fvr","fwa","fwe","fy","ga","gaa","gab","gac","gad","gae","gaf","gag","gah","gai","gaj","gak","gal","gam","gan","gao","gap","gaq","gar","gas","gat","gau","gav","gaw","gax","gay","gaz","gba","gbb","gbc","gbd","gbe","gbf","gbg","gbh","gbi","gbj","gbk","gbl","gbm","gbn","gbo","gbp","gbq","gbr","gbs","gbu","gbv","gbw","gbx","gby","gbz","gcc","gcd","gce","gcf","gcl","gcn","gcr","gct","gd","gda","gdb","gdc","gdd","gde","gdf","gdg","gdh","gdi","gdj","gdk","gdl","gdm","gdn","gdo","gdq","gdr","gds","gdt","gdu","gdx","gea","geb","gec","ged","gef","geg","geh","gei","gej","gek","gel","gem","geq","ges","gev","gew","gex","gey","gez","gfk","gft","gfx","gga","ggb","ggd","gge","ggg","ggk","ggl","ggn","ggo","ggr","ggt","ggu","ggw","gha","ghc","ghe","ghh","ghk","ghl","ghn","gho","ghr","ghs","ght","gia","gib","gic","gid","gie","gig","gih","gii","gil","gim","gin","gio","gip","giq","gir","gis","git","giu","giw","gix","giy","giz","gji","gjk","gjm","gjn","gjr","gju","gka","gkd","gke","gkn","gko","gkp","gku","gl","glb","glc","gld","glh","gli","glj","glk","gll","glo","glr","glu","glw","gly","gma","gmb","gmd","gme","gmg","gmh","gml","gmm","gmn","gmq","gmr","gmu","gmv","gmw","gmx","gmy","gmz","gn","gna","gnb","gnc","gnd","gne","gng","gnh","gni","gnj","gnk","gnl","gnm","gnn","gno","gnq","gnr","gnt","gnu","gnw","gnz","goa","gob","goc","god","goe","gof","gog","goh","goi","goj","gok","gol","gom","gon","goo","gop","goq","gor","gos","got","gou","gov","gow","gox","goy","goz","gpa","gpe","gpn","gqa","gqi","gqn","gqr","gqu","gra","grb","grc","grd","grg","grh","gri","grj","grk","grm","gro","grq","grr","grs","grt","gru","grv","grw","grx","gry","grz","gse","gsg","gsl","gsm","gsn","gso","gsp","gss","gsw","gta","gti","gtu","gu","gua","gub","guc","gud","gue","guf","gug","guh","gui","guk","gul","gum","gun","guo","gup","guq","gur","gus","gut","guu","guv","guw","gux","guz","gv","gva","gvc","gve","gvf","gvj","gvl","gvm","gvn","gvo","gvp","gvr","gvs","gvy","gwa","gwb","gwc","gwd","gwe","gwf","gwg","gwi","gwj","gwm","gwn","gwr","gwt","gwu","gww","gwx","gxx","gya","gyb","gyd","gye","gyf","gyg","gyi","gyl","gym","gyn","gyo","gyr","gyy","gyz","gza","gzi","gzn","ha","haa","hab","hac","had","hae","haf","hag","hah","hai","haj","hak","hal","ham","han","hao","hap","haq","har","has","hav","haw","hax","hay","haz","hba","hbb","hbn","hbo","hbu","hca","hch","hdn","hds","hdy","he","hea","hed","heg","heh","hei","hem","hgm","hgw","hhi","hhr","hhy","hi","hia","hib","hid","hif","hig","hih","hii","hij","hik","hil","him","hio","hir","hit","hiw","hix","hji","hka","hke","hkh","hkk","hkn","hks","hla","hlb","hld","hle","hlt","hlu","hma","hmb","hmc","hmd","hme","hmf","hmg","hmh","hmi","hmj","hmk","hml","hmm","hmn","hmp","hmq","hmr","hms","hmt","hmu","hmv","hmw","hmx","hmy","hmz","hna","hnd","hne","hng","hnh","hni","hnj","hnm","hnn","hno","hns","hnu","ho","hoa","hob","hoc","hod","hoe","hoh","hoi","hoj","hok","hol","hom","hoo","hop","hor","hos","hot","hov","how","hoy","hoz","hpo","hps","hr","hra","hrc","hre","hrk","hrm","hro","hrp","hrr","hrt","hru","hrw","hrx","hrz","hsb","hsh","hsl","hsn","hss","ht","hti","hto","hts","htu","htx","hu","hub","huc","hud","hue","huf","hug","huh","hui","huj","huk","hul","hum","huo","hup","huq","hur","hus","hut","huu","huv","huw","hux","huy","huz","hvc","hve","hvk","hvn","hvv","hwa","hwc","hwo","hy","hya","hyw","hyx","hz","ia","iai","ian","iap","iar","iba","ibb","ibd","ibe","ibg","ibh","ibi","ibl","ibm","ibn","ibr","ibu","iby","ica","ich","icl","icr","id","ida","idb","idc","idd","ide","idi","idr","ids","idt","idu","ie","ifa","ifb","ife","iff","ifk","ifm","ifu","ify","ig","igb","ige","igg","igl","igm","ign","igo","igs","igw","ihb","ihi","ihp","ihw","ii","iin","iir","ijc","ije","ijj","ijn","ijo","ijs","ik","ike","ikh","iki","ikk","ikl","iko","ikp","ikr","iks","ikt","ikv","ikw","ikx","ikz","ila","ilb","ilg","ili","ilk","ill","ilm","ilo","ilp","ils","ilu","ilv","ilw","ima","ime","imi","iml","imn","imo","imr","ims","imt","imy","in","inb","inc","ine","ing","inh","inj","inl","inm","inn","ino","inp","ins","int","inz","io","ior","iou","iow","ipi","ipo","iqu","iqw","ira","ire","irh","iri","irk","irn","iro","irr","iru","irx","iry","is","isa","isc","isd","ise","isg","ish","isi","isk","ism","isn","iso","isr","ist","isu","isv","it","itb","itc","itd","ite","iti","itk","itl","itm","ito","itr","its","itt","itv","itw","itx","ity","itz","iu","ium","ivb","ivv","iw","iwk","iwm","iwo","iws","ixc","ixl","iya","iyo","iyx","izh","izi","izm","izr","izz","ja","jaa","jab","jac","jad","jae","jaf","jah","jaj","jak","jal","jam","jan","jao","jaq","jar","jas","jat","jau","jax","jay","jaz","jbe","jbi","jbj","jbk","jbm","jbn","jbo","jbr","jbt","jbu","jbw","jcs","jct","jda","jdg","jdt","jeb","jee","jeg","jeh","jei","jek","jel","jen","jer","jet","jeu","jgb","jge","jgk","jgo","jhi","jhs","ji","jia","jib","jic","jid","jie","jig","jih","jii","jil","jim","jio","jiq","jit","jiu","jiv","jiy","jje","jjr","jka","jkm","jko","jkp","jkr","jks","jku","jle","jls","jma","jmb","jmc","jmd","jmi","jml","jmn","jmr","jms","jmw","jmx","jna","jnd","jng","jni","jnj","jnl","jns","job","jod","jog","jor","jos","jow","jpa","jpr","jpx","jqr","jra","jrb","jrr","jrt","jru","jsl","jua","jub","juc","jud","juh","jui","juk","jul","jum","jun","juo","jup","jur","jus","jut","juu","juw","juy","jv","jvd","jvn","jw","jwi","jya","jye","jyy","ka","kaa","kab","kac","kad","kae","kaf","kag","kah","kai","kaj","kak","kam","kao","kap","kaq","kar","kav","kaw","kax","kay","kba","kbb","kbc","kbd","kbe","kbf","kbg","kbh","kbi","kbj","kbk","kbl","kbm","kbn","kbo","kbp","kbq","kbr","kbs","kbt","kbu","kbv","kbw","kbx","kby","kbz","kca","kcb","kcc","kcd","kce","kcf","kcg","kch","kci","kcj","kck","kcl","kcm","kcn","kco","kcp","kcq","kcr","kcs","kct","kcu","kcv","kcw","kcx","kcy","kcz","kda","kdc","kdd","kde","kdf","kdg","kdh","kdi","kdj","kdk","kdl","kdm","kdn","kdo","kdp","kdq","kdr","kdt","kdu","kdv","kdw","kdx","kdy","kdz","kea","keb","kec","ked","kee","kef","keg","keh","kei","kej","kek","kel","kem","ken","keo","kep","keq","ker","kes","ket","keu","kev","kew","kex","key","kez","kfa","kfb","kfc","kfd","kfe","kff","kfg","kfh","kfi","kfj","kfk","kfl","kfm","kfn","kfo","kfp","kfq","kfr","kfs","kft","kfu","kfv","kfw","kfx","kfy","kfz","kg","kga","kgb","kgc","kgd","kge","kgf","kgg","kgh","kgi","kgj","kgk","kgl","kgm","kgn","kgo","kgp","kgq","kgr","kgs","kgt","kgu","kgv","kgw","kgx","kgy","kha","khb","khc","khd","khe","khf","khg","khh","khi","khj","khk","khl","khn","kho","khp","khq","khr","khs","kht","khu","khv","khw","khx","khy","khz","ki","kia","kib","kic","kid","kie","kif","kig","kih","kii","kij","kil","kim","kio","kip","kiq","kis","kit","kiu","kiv","kiw","kix","kiy","kiz","kj","kja","kjb","kjc","kjd","kje","kjf","kjg","kjh","kji","kjj","kjk","kjl","kjm","kjn","kjo","kjp","kjq","kjr","kjs","kjt","kju","kjv","kjx","kjy","kjz","kk","kka","kkb","kkc","kkd","kke","kkf","kkg","kkh","kki","kkj","kkk","kkl","kkm","kkn","kko","kkp","kkq","kkr","kks","kkt","kku","kkv","kkw","kkx","kky","kkz","kl","kla","klb","klc","kld","kle","klf","klg","klh","kli","klj","klk","kll","klm","kln","klo","klp","klq","klr","kls","klt","klu","klv","klw","klx","kly","klz","km","kma","kmb","kmc","kmd","kme","kmf","kmg","kmh","kmi","kmj","kmk","kml","kmm","kmn","kmo","kmp","kmq","kmr","kms","kmt","kmu","kmv","kmw","kmx","kmy","kmz","kn","kna","knb","knc","knd","kne","knf","kng","kni","knj","knk","knl","knm","knn","kno","knp","knq","knr","kns","knt","knu","knv","knw","knx","kny","knz","ko","koa","koc","kod","koe","kof","kog","koh","koi","koj","kok","kol","koo","kop","koq","kos","kot","kou","kov","kow","kox","koy","koz","kpa","kpb","kpc","kpd","kpe","kpf","kpg","kph","kpi","kpj","kpk","kpl","kpm","kpn","kpo","kpp","kpq","kpr","kps","kpt","kpu","kpv","kpw","kpx","kpy","kpz","kqa","kqb","kqc","kqd","kqe","kqf","kqg","kqh","kqi","kqj","kqk","kql","kqm","kqn","kqo","kqp","kqq","kqr","kqs","kqt","kqu","kqv","kqw","kqx","kqy","kqz","kr","kra","krb","krc","krd","kre","krf","krh","kri","krj","krk","krl","krm","krn","kro","krp","krr","krs","krt","kru","krv","krw","krx","kry","krz","ks","ksa","ksb","ksc","ksd","kse","ksf","ksg","ksh","ksi","ksj","ksk","ksl","ksm","ksn","kso","ksp","ksq","ksr","kss","kst","ksu","ksv","ksw","ksx","ksy","ksz","kta","ktb","ktc","ktd","kte","ktf","ktg","kth","kti","ktj","ktk","ktl","ktm","ktn","kto","ktp","ktq","ktr","kts","ktt","ktu","ktv","ktw","ktx","kty","ktz","ku","kub","kuc","kud","kue","kuf","kug","kuh","kui","kuj","kuk","kul","kum","kun","kuo","kup","kuq","kus","kut","kuu","kuv","kuw","kux","kuy","kuz","kv","kva","kvb","kvc","kvd","kve","kvf","kvg","kvh","kvi","kvj","kvk","kvl","kvm","kvn","kvo","kvp","kvq","kvr","kvs","kvt","kvu","kvv","kvw","kvx","kvy","kvz","kw","kwa","kwb","kwc","kwd","kwe","kwf","kwg","kwh","kwi","kwj","kwk","kwl","kwm","kwn","kwo","kwp","kwq","kwr","kws","kwt","kwu","kwv","kww","kwx","kwy","kwz","kxa","kxb","kxc","kxd","kxe","kxf","kxh","kxi","kxj","kxk","kxl","kxm","kxn","kxo","kxp","kxq","kxr","kxs","kxt","kxu","kxv","kxw","kxx","kxy","kxz","ky","kya","kyb","kyc","kyd","kye","kyf","kyg","kyh","kyi","kyj","kyk","kyl","kym","kyn","kyo","kyp","kyq","kyr","kys","kyt","kyu","kyv","kyw","kyx","kyy","kyz","kza","kzb","kzc","kzd","kze","kzf","kzg","kzh","kzi","kzj","kzk","kzl","kzm","kzn","kzo","kzp","kzq","kzr","kzs","kzt","kzu","kzv","kzw","kzx","kzy","kzz","la","laa","lab","lac","lad","lae","laf","lag","lah","lai","laj","lak","lal","lam","lan","lap","laq","lar","las","lau","law","lax","lay","laz","lb","lba","lbb","lbc","lbe","lbf","lbg","lbi","lbj","lbk","lbl","lbm","lbn","lbo","lbq","lbr","lbs","lbt","lbu","lbv","lbw","lbx","lby","lbz","lcc","lcd","lce","lcf","lch","lcl","lcm","lcp","lcq","lcs","lda","ldb","ldd","ldg","ldh","ldi","ldj","ldk","ldl","ldm","ldn","ldo","ldp","ldq","lea","leb","lec","led","lee","lef","leg","leh","lei","lej","lek","lel","lem","len","leo","lep","leq","ler","les","let","leu","lev","lew","lex","ley","lez","lfa","lfb","lfn","lg","lga","lgb","lgg","lgh","lgi","lgk","lgl","lgm","lgn","lgo","lgq","lgr","lgs","lgt","lgu","lgz","lha","lhh","lhi","lhl","lhm","lhn","lhp","lhs","lht","lhu","li","lia","lib","lic","lid","lie","lif","lig","lih","lii","lij","lik","lil","lio","lip","liq","lir","lis","liu","liv","liw","lix","liy","liz","lja","lje","lji","ljl","ljp","ljw","ljx","lka","lkb","lkc","lkd","lke","lkh","lki","lkj","lkl","lkm","lkn","lko","lkr","lks","lkt","lku","lky","lla","llb","llc","lld","lle","llf","llg","llh","lli","llj","llk","lll","llm","lln","llo","llp","llq","lls","llu","llx","lma","lmb","lmc","lmd","lme","lmf","lmg","lmh","lmi","lmj","lmk","lml","lmm","lmn","lmo","lmp","lmq","lmr","lmu","lmv","lmw","lmx","lmy","lmz","ln","lna","lnb","lnd","lng","lnh","lni","lnj","lnl","lnm","lnn","lno","lns","lnu","lnw","lnz","lo","loa","lob","loc","loe","lof","log","loh","loi","loj","lok","lol","lom","lon","loo","lop","loq","lor","los","lot","lou","lov","low","lox","loy","loz","lpa","lpe","lpn","lpo","lpx","lqr","lra","lrc","lre","lrg","lri","lrk","lrl","lrm","lrn","lro","lrr","lrt","lrv","lrz","lsa","lsb","lsc","lsd","lse","lsg","lsh","lsi","lsl","lsm","lsn","lso","lsp","lsr","lss","lst","lsv","lsw","lsy","lt","ltc","ltg","lth","lti","ltn","lto","lts","ltu","lu","lua","luc","lud","lue","luf","luh","lui","luj","luk","lul","lum","lun","luo","lup","luq","lur","lus","lut","luu","luv","luw","luy","luz","lv","lva","lvi","lvk","lvl","lvs","lvu","lwa","lwe","lwg","lwh","lwl","lwm","lwo","lws","lwt","lwu","lww","lxm","lya","lyg","lyn","lzh","lzl","lzn","lzz","maa","mab","mad","mae","maf","mag","mai","maj","mak","mam","man","map","maq","mas","mat","mau","mav","maw","max","maz","mba","mbb","mbc","mbd","mbe","mbf","mbh","mbi","mbj","mbk","mbl","mbm","mbn","mbo","mbp","mbq","mbr","mbs","mbt","mbu","mbv","mbw","mbx","mby","mbz","mca","mcb","mcc","mcd","mce","mcf","mcg","mch","mci","mcj","mck","mcl","mcm","mcn","mco","mcp","mcq","mcr","mcs","mct","mcu","mcv","mcw","mcx","mcy","mcz","mda","mdb","mdc","mdd","mde","mdf","mdg","mdh","mdi","mdj","mdk","mdl","mdm","mdn","mdp","mdq","mdr","mds","mdt","mdu","mdv","mdw","mdx","mdy","mdz","mea","meb","mec","med","mee","mef","meg","meh","mei","mej","mek","mel","mem","men","meo","mep","meq","mer","mes","met","meu","mev","mew","mey","mez","mfa","mfb","mfc","mfd","mfe","mff","mfg","mfh","mfi","mfj","mfk","mfl","mfm","mfn","mfo","mfp","mfq","mfr","mfs","mft","mfu","mfv","mfw","mfx","mfy","mfz","mg","mga","mgb","mgc","mgd","mge","mgf","mgg","mgh","mgi","mgj","mgk","mgl","mgm","mgn","mgo","mgp","mgq","mgr","mgs","mgt","mgu","mgv","mgw","mgx","mgy","mgz","mh","mha","mhb","mhc","mhd","mhe","mhf","mhg","mhh","mhi","mhj","mhk","mhl","mhm","mhn","mho","mhp","mhq","mhr","mhs","mht","mhu","mhw","mhx","mhy","mhz","mi","mia","mib","mic","mid","mie","mif","mig","mih","mii","mij","mik","mil","mim","min","mio","mip","miq","mir","mit","miu","miw","mix","miy","miz","mja","mjb","mjc","mjd","mje","mjg","mjh","mji","mjj","mjk","mjl","mjm","mjn","mjo","mjp","mjq","mjr","mjs","mjt","mju","mjv","mjw","mjx","mjy","mjz","mk","mka","mkb","mkc","mke","mkf","mkg","mkh","mki","mkj","mkk","mkl","mkm","mkn","mko","mkp","mkq","mkr","mks","mkt","mku","mkv","mkw","mkx","mky","mkz","ml","mla","mlb","mlc","mld","mle","mlf","mlh","mli","mlj","mlk","mll","mlm","mln","mlo","mlp","mlq","mlr","mls","mlu","mlv","mlw","mlx","mlz","mma","mmb","mmc","mmd","mme","mmf","mmg","mmh","mmi","mmj","mmk","mml","mmm","mmn","mmo","mmp","mmq","mmr","mmt","mmu","mmv","mmw","mmx","mmy","mmz","mn","mna","mnb","mnc","mnd","mne","mnf","mng","mnh","mni","mnj","mnk","mnl","mnm","mnn","mno","mnp","mnq","mnr","mns","mnt","mnu","mnv","mnw","mnx","mny","mnz","mo","moa","moc","mod","moe","mof","mog","moh","moi","moj","mok","mom","moo","mop","moq","mor","mos","mot","mou","mov","mow","mox","moy","moz","mpa","mpb","mpc","mpd","mpe","mpg","mph","mpi","mpj","mpk","mpl","mpm","mpn","mpo","mpp","mpq","mpr","mps","mpt","mpu","mpv","mpw","mpx","mpy","mpz","mqa","mqb","mqc","mqe","mqf","mqg","mqh","mqi","mqj","mqk","mql","mqm","mqn","mqo","mqp","mqq","mqr","mqs","mqt","mqu","mqv","mqw","mqx","mqy","mqz","mr","mra","mrb","mrc","mrd","mre","mrf","mrg","mrh","mrj","mrk","mrl","mrm","mrn","mro","mrp","mrq","mrr","mrs","mrt","mru","mrv","mrw","mrx","mry","mrz","ms","msb","msc","msd","mse","msf","msg","msh","msi","msj","msk","msl","msm","msn","mso","msp","msq","msr","mss","mst","msu","msv","msw","msx","msy","msz","mt","mta","mtb","mtc","mtd","mte","mtf","mtg","mth","mti","mtj","mtk","mtl","mtm","mtn","mto","mtp","mtq","mtr","mts","mtt","mtu","mtv","mtw","mtx","mty","mua","mub","muc","mud","mue","mug","muh","mui","muj","muk","mum","mun","muo","mup","muq","mur","mus","mut","muu","muv","mux","muy","muz","mva","mvb","mvd","mve","mvf","mvg","mvh","mvi","mvk","mvl","mvm","mvn","mvo","mvp","mvq","mvr","mvs","mvt","mvu","mvv","mvw","mvx","mvy","mvz","mwa","mwb","mwc","mwd","mwe","mwf","mwg","mwh","mwi","mwj","mwk","mwl","mwm","mwn","mwo","mwp","mwq","mwr","mws","mwt","mwu","mwv","mww","mwx","mwy","mwz","mxa","mxb","mxc","mxd","mxe","mxf","mxg","mxh","mxi","mxj","mxk","mxl","mxm","mxn","mxo","mxp","mxq","mxr","mxs","mxt","mxu","mxv","mxw","mxx","mxy","mxz","my","myb","myc","myd","mye","myf","myg","myh","myi","myj","myk","myl","mym","myn","myo","myp","myq","myr","mys","myt","myu","myv","myw","myx","myy","myz","mza","mzb","mzc","mzd","mze","mzg","mzh","mzi","mzj","mzk","mzl","mzm","mzn","mzo","mzp","mzq","mzr","mzs","mzt","mzu","mzv","mzw","mzx","mzy","mzz","na","naa","nab","nac","nad","nae","naf","nag","nah","nai","naj","nak","nal","nam","nan","nao","nap","naq","nar","nas","nat","naw","nax","nay","naz","nb","nba","nbb","nbc","nbd","nbe","nbf","nbg","nbh","nbi","nbj","nbk","nbm","nbn","nbo","nbp","nbq","nbr","nbs","nbt","nbu","nbv","nbw","nbx","nby","nca","ncb","ncc","ncd","nce","ncf","ncg","nch","nci","ncj","nck","ncl","ncm","ncn","nco","ncp","ncq","ncr","ncs","nct","ncu","ncx","ncz","nd","nda","ndb","ndc","ndd","ndf","ndg","ndh","ndi","ndj","ndk","ndl","ndm","ndn","ndp","ndq","ndr","nds","ndt","ndu","ndv","ndw","ndx","ndy","ndz","ne","nea","neb","nec","ned","nee","nef","neg","neh","nei","nej","nek","nem","nen","neo","neq","ner","nes","net","neu","nev","new","nex","ney","nez","nfa","nfd","nfl","nfr","nfu","ng","nga","ngb","ngc","ngd","nge","ngf","ngg","ngh","ngi","ngj","ngk","ngl","ngm","ngn","ngo","ngp","ngq","ngr","ngs","ngt","ngu","ngv","ngw","ngx","ngy","ngz","nha","nhb","nhc","nhd","nhe","nhf","nhg","nhh","nhi","nhk","nhm","nhn","nho","nhp","nhq","nhr","nht","nhu","nhv","nhw","nhx","nhy","nhz","nia","nib","nic","nid","nie","nif","nig","nih","nii","nij","nik","nil","nim","nin","nio","niq","nir","nis","nit","niu","niv","niw","nix","niy","niz","nja","njb","njd","njh","nji","njj","njl","njm","njn","njo","njr","njs","njt","nju","njx","njy","njz","nka","nkb","nkc","nkd","nke","nkf","nkg","nkh","nki","nkj","nkk","nkm","nkn","nko","nkp","nkq","nkr","nks","nkt","nku","nkv","nkw","nkx","nkz","nl","nla","nlc","nle","nlg","nli","nlj","nlk","nll","nlm","nln","nlo","nlq","nlr","nlu","nlv","nlw","nlx","nly","nlz","nma","nmb","nmc","nmd","nme","nmf","nmg","nmh","nmi","nmj","nmk","nml","nmm","nmn","nmo","nmp","nmq","nmr","nms","nmt","nmu","nmv","nmw","nmx","nmy","nmz","nn","nna","nnb","nnc","nnd","nne","nnf","nng","nnh","nni","nnj","nnk","nnl","nnm","nnn","nnp","nnq","nnr","nns","nnt","nnu","nnv","nnw","nnx","nny","nnz","no","noa","noc","nod","noe","nof","nog","noh","noi","noj","nok","nol","nom","non","noo","nop","noq","nos","not","nou","nov","now","noy","noz","npa","npb","npg","nph","npi","npl","npn","npo","nps","npu","npx","npy","nqg","nqk","nql","nqm","nqn","nqo","nqq","nqt","nqy","nr","nra","nrb","nrc","nre","nrf","nrg","nri","nrk","nrl","nrm","nrn","nrp","nrr","nrt","nru","nrx","nrz","nsa","nsb","nsc","nsd","nse","nsf","nsg","nsh","nsi","nsk","nsl","nsm","nsn","nso","nsp","nsq","nsr","nss","nst","nsu","nsv","nsw","nsx","nsy","nsz","ntd","nte","ntg","nti","ntj","ntk","ntm","nto","ntp","ntr","nts","ntu","ntw","ntx","nty","ntz","nua","nub","nuc","nud","nue","nuf","nug","nuh","nui","nuj","nuk","nul","num","nun","nuo","nup","nuq","nur","nus","nut","nuu","nuv","nuw","nux","nuy","nuz","nv","nvh","nvm","nvo","nwa","nwb","nwc","nwe","nwg","nwi","nwm","nwo","nwr","nww","nwx","nwy","nxa","nxd","nxe","nxg","nxi","nxk","nxl","nxm","nxn","nxo","nxq","nxr","nxu","nxx","ny","nyb","nyc","nyd","nye","nyf","nyg","nyh","nyi","nyj","nyk","nyl","nym","nyn","nyo","nyp","nyq","nyr","nys","nyt","nyu","nyv","nyw","nyx","nyy","nza","nzb","nzd","nzi","nzk","nzm","nzr","nzs","nzu","nzy","nzz","oaa","oac","oak","oar","oav","obi","obk","obl","obm","obo","obr","obt","obu","oc","oca","och","ocm","oco","ocu","oda","odk","odt","odu","ofo","ofs","ofu","ogb","ogc","oge","ogg","ogo","ogu","oht","ohu","oia","oie","oin","oj","ojb","ojc","ojg","ojp","ojs","ojv","ojw","oka","okb","okc","okd","oke","okg","okh","oki","okj","okk","okl","okm","okn","oko","okr","oks","oku","okv","okx","okz","ola","olb","old","ole","olk","olm","olo","olr","olt","olu","om","oma","omb","omc","ome","omg","omi","omk","oml","omn","omo","omp","omq","omr","omt","omu","omv","omw","omx","omy","ona","onb","one","ong","oni","onj","onk","onn","ono","onp","onr","ons","ont","onu","onw","onx","ood","oog","oon","oor","oos","opa","opk","opm","opo","opt","opy","or","ora","orc","ore","org","orh","orn","oro","orr","ors","ort","oru","orv","orw","orx","ory","orz","os","osa","osc","osd","osi","osn","oso","osp","ost","osu","osx","ota","otb","otd","ote","oti","otk","otl","otm","otn","oto","otq","otr","ots","ott","otu","otw","otx","oty","otz","oua","oub","oue","oui","oum","oun","ovd","owi","owl","oyb","oyd","oym","oyy","ozm","pa","paa","pab","pac","pad","pae","paf","pag","pah","pai","pak","pal","pam","pao","pap","paq","par","pas","pat","pau","pav","paw","pax","pay","paz","pbb","pbc","pbe","pbf","pbg","pbh","pbi","pbl","pbm","pbn","pbo","pbp","pbr","pbs","pbt","pbu","pbv","pby","pbz","pca","pcb","pcc","pcd","pce","pcf","pcg","pch","pci","pcj","pck","pcl","pcm","pcn","pcp","pcr","pcw","pda","pdc","pdi","pdn","pdo","pdt","pdu","pea","peb","ped","pee","pef","peg","peh","pei","pej","pek","pel","pem","peo","pep","peq","pes","pev","pex","pey","pez","pfa","pfe","pfl","pga","pgd","pgg","pgi","pgk","pgl","pgn","pgs","pgu","pgy","pgz","pha","phd","phg","phh","phi","phj","phk","phl","phm","phn","pho","phq","phr","pht","phu","phv","phw","pi","pia","pib","pic","pid","pie","pif","pig","pih","pii","pij","pil","pim","pin","pio","pip","pir","pis","pit","piu","piv","piw","pix","piy","piz","pjt","pka","pkb","pkc","pkg","pkh","pkn","pko","pkp","pkr","pks","pkt","pku","pl","pla","plb","plc","pld","ple","plf","plg","plh","plj","plk","pll","pln","plo","plp","plq","plr","pls","plt","plu","plv","plw","ply","plz","pma","pmb","pmc","pmd","pme","pmf","pmh","pmi","pmj","pmk","pml","pmm","pmn","pmo","pmq","pmr","pms","pmt","pmu","pmw","pmx","pmy","pmz","pna","pnb","pnc","pnd","pne","png","pnh","pni","pnj","pnk","pnl","pnm","pnn","pno","pnp","pnq","pnr","pns","pnt","pnu","pnv","pnw","pnx","pny","pnz","poc","pod","poe","pof","pog","poh","poi","pok","pom","pon","poo","pop","poq","pos","pot","pov","pow","pox","poy","poz","ppa","ppe","ppi","ppk","ppl","ppm","ppn","ppo","ppp","ppq","ppr","pps","ppt","ppu","pqa","pqe","pqm","pqw","pra","prb","prc","prd","pre","prf","prg","prh","pri","prk","prl","prm","prn","pro","prp","prq","prr","prs","prt","pru","prw","prx","pry","prz","ps","psa","psc","psd","pse","psg","psh","psi","psl","psm","psn","pso","psp","psq","psr","pss","pst","psu","psw","psy","pt","pta","pth","pti","ptn","pto","ptp","ptq","ptr","ptt","ptu","ptv","ptw","pty","pua","pub","puc","pud","pue","puf","pug","pui","puj","puk","pum","puo","pup","puq","pur","put","puu","puw","pux","puy","puz","pwa","pwb","pwg","pwi","pwm","pwn","pwo","pwr","pww","pxm","pye","pym","pyn","pys","pyu","pyx","pyy","pze","pzh","pzn","qu","qua","qub","quc","qud","quf","qug","quh","qui","quk","qul","qum","qun","qup","quq","qur","qus","quv","quw","qux","quy","quz","qva","qvc","qve","qvh","qvi","qvj","qvl","qvm","qvn","qvo","qvp","qvs","qvw","qvy","qvz","qwa","qwc","qwe","qwh","qwm","qws","qwt","qxa","qxc","qxh","qxl","qxn","qxo","qxp","qxq","qxr","qxs","qxt","qxu","qxw","qya","qyp","raa","rab","rac","rad","raf","rag","rah","rai","raj","rak","ral","ram","ran","rao","rap","raq","rar","ras","rat","rau","rav","raw","rax","ray","raz","rbb","rbk","rbl","rbp","rcf","rdb","rea","reb","ree","reg","rei","rej","rel","rem","ren","rer","res","ret","rey","rga","rge","rgk","rgn","rgr","rgs","rgu","rhg","rhp","ria","rib","rie","rif","ril","rim","rin","rir","rit","riu","rjg","rji","rjs","rka","rkb","rkh","rki","rkm","rkt","rkw","rm","rma","rmb","rmc","rmd","rme","rmf","rmg","rmh","rmi","rmk","rml","rmm","rmn","rmo","rmp","rmq","rmr","rms","rmt","rmu","rmv","rmw","rmx","rmy","rmz","rn","rna","rnb","rnd","rng","rnl","rnn","rnp","rnr","rnw","ro","roa","rob","roc","rod","roe","rof","rog","rol","rom","roo","rop","ror","rou","row","rpn","rpt","rri","rrm","rro","rrt","rsb","rsi","rsk","rsl","rsm","rsn","rsw","rtc","rth","rtm","rts","rtw","ru","rub","ruc","rue","ruf","rug","ruh","rui","ruk","ruo","rup","ruq","rut","ruu","ruy","ruz","rw","rwa","rwk","rwl","rwm","rwo","rwr","rxd","rxw","ryn","rys","ryu","rzh","sa","saa","sab","sac","sad","sae","saf","sah","sai","saj","sak","sal","sam","sao","sap","saq","sar","sas","sat","sau","sav","saw","sax","say","saz","sba","sbb","sbc","sbd","sbe","sbf","sbg","sbh","sbi","sbj","sbk","sbl","sbm","sbn","sbo","sbp","sbq","sbr","sbs","sbt","sbu","sbv","sbw","sbx","sby","sbz","sc","sca","scb","sce","scf","scg","sch","sci","sck","scl","scn","sco","scp","scq","scs","sct","scu","scv","scw","scx","scz","sd","sda","sdb","sdc","sde","sdf","sdg","sdh","sdj","sdk","sdl","sdm","sdn","sdo","sdp","sdq","sdr","sds","sdt","sdu","sdv","sdx","sdz","se","sea","seb","sec","sed","see","sef","seg","seh","sei","sej","sek","sel","sem","sen","seo","sep","seq","ser","ses","set","seu","sev","sew","sey","sez","sfb","sfe","sfm","sfs","sfw","sg","sga","sgb","sgc","sgd","sge","sgg","sgh","sgi","sgj","sgk","sgl","sgm","sgn","sgo","sgp","sgr","sgs","sgt","sgu","sgw","sgx","sgy","sgz","sh","sha","shb","shc","shd","she","shg","shh","shi","shj","shk","shl","shm","shn","sho","shp","shq","shr","shs","sht","shu","shv","shw","shx","shy","shz","si","sia","sib","sid","sie","sif","sig","sih","sii","sij","sik","sil","sim","sio","sip","siq","sir","sis","sit","siu","siv","siw","six","siy","siz","sja","sjb","sjc","sjd","sje","sjg","sjk","sjl","sjm","sjn","sjo","sjp","sjr","sjs","sjt","sju","sjw","sk","ska","skb","skc","skd","ske","skf","skg","skh","ski","skj","skk","skm","skn","sko","skp","skq","skr","sks","skt","sku","skv","skw","skx","sky","skz","sl","sla","slc","sld","sle","slf","slg","slh","sli","slj","sll","slm","sln","slp","slq","slr","sls","slt","slu","slw","slx","sly","slz","sm","sma","smb","smc","smd","smf","smg","smh","smi","smj","smk","sml","smm","smn","smp","smq","smr","sms","smt","smu","smv","smw","smx","smy","smz","sn","snb","snc","sne","snf","sng","snh","sni","snj","snk","snl","snm","snn","sno","snp","snq","snr","sns","snu","snv","snw","snx","sny","snz","so","soa","sob","soc","sod","soe","sog","soh","soi","soj","sok","sol","son","soo","sop","soq","sor","sos","sou","sov","sow","sox","soy","soz","spb","spc","spd","spe","spg","spi","spk","spl","spm","spn","spo","spp","spq","spr","sps","spt","spu","spv","spx","spy","sq","sqa","sqh","sqj","sqk","sqm","sqn","sqo","sqq","sqr","sqs","sqt","squ","sqx","sr","sra","srb","src","sre","srf","srg","srh","sri","srk","srl","srm","srn","sro","srq","srr","srs","srt","sru","srv","srw","srx","sry","srz","ss","ssa","ssb","ssc","ssd","sse","ssf","ssg","ssh","ssi","ssj","ssk","ssl","ssm","ssn","sso","ssp","ssq","ssr","sss","sst","ssu","ssv","ssx","ssy","ssz","st","sta","stb","std","ste","stf","stg","sth","sti","stj","stk","stl","stm","stn","sto","stp","stq","str","sts","stt","stu","stv","stw","sty","su","sua","sub","suc","sue","sug","sui","suj","suk","sul","sum","suo","suq","sur","sus","sut","suv","suw","sux","suy","suz","sv","sva","svb","svc","sve","svk","svm","svr","svs","svx","sw","swb","swc","swf","swg","swh","swi","swj","swk","swl","swm","swn","swo","swp","swq","swr","sws","swt","swu","swv","sww","swx","swy","sxb","sxc","sxe","sxg","sxk","sxl","sxm","sxn","sxo","sxr","sxs","sxu","sxw","sya","syb","syc","syd","syi","syk","syl","sym","syn","syo","syr","sys","syw","syx","syy","sza","szb","szc","szd","sze","szg","szl","szn","szp","szs","szv","szw","szy","ta","taa","tab","tac","tad","tae","taf","tag","tai","taj","tak","tal","tan","tao","tap","taq","tar","tas","tau","tav","taw","tax","tay","taz","tba","tbb","tbc","tbd","tbe","tbf","tbg","tbh","tbi","tbj","tbk","tbl","tbm","tbn","tbo","tbp","tbq","tbr","tbs","tbt","tbu","tbv","tbw","tbx","tby","tbz","tca","tcb","tcc","tcd","tce","tcf","tcg","tch","tci","tck","tcl","tcm","tcn","tco","tcp","tcq","tcs","tct","tcu","tcw","tcx","tcy","tcz","tda","tdb","tdc","tdd","tde","tdf","tdg","tdh","tdi","tdj","tdk","tdl","tdm","tdn","tdo","tdq","tdr","tds","tdt","tdu","tdv","tdx","tdy","te","tea","teb","tec","ted","tee","tef","teg","teh","tei","tek","tem","ten","teo","tep","teq","ter","tes","tet","teu","tev","tew","tex","tey","tez","tfi","tfn","tfo","tfr","tft","tg","tga","tgb","tgc","tgd","tge","tgf","tgg","tgh","tgi","tgj","tgn","tgo","tgp","tgq","tgr","tgs","tgt","tgu","tgv","tgw","tgx","tgy","tgz","th","thc","thd","the","thf","thh","thi","thk","thl","thm","thn","thp","thq","thr","ths","tht","thu","thv","thw","thx","thy","thz","ti","tia","tic","tid","tie","tif","tig","tih","tii","tij","tik","til","tim","tin","tio","tip","tiq","tis","tit","tiu","tiv","tiw","tix","tiy","tiz","tja","tjg","tji","tjj","tjl","tjm","tjn","tjo","tjp","tjs","tju","tjw","tk","tka","tkb","tkd","tke","tkf","tkg","tkk","tkl","tkm","tkn","tkp","tkq","tkr","tks","tkt","tku","tkv","tkw","tkx","tkz","tl","tla","tlb","tlc","tld","tlf","tlg","tlh","tli","tlj","tlk","tll","tlm","tln","tlo","tlp","tlq","tlr","tls","tlt","tlu","tlv","tlw","tlx","tly","tma","tmb","tmc","tmd","tme","tmf","tmg","tmh","tmi","tmj","tmk","tml","tmm","tmn","tmo","tmp","tmq","tmr","tms","tmt","tmu","tmv","tmw","tmy","tmz","tn","tna","tnb","tnc","tnd","tne","tnf","tng","tnh","tni","tnk","tnl","tnm","tnn","tno","tnp","tnq","tnr","tns","tnt","tnu","tnv","tnw","tnx","tny","tnz","to","tob","toc","tod","toe","tof","tog","toh","toi","toj","tok","tol","tom","too","top","toq","tor","tos","tou","tov","tow","tox","toy","toz","tpa","tpc","tpe","tpf","tpg","tpi","tpj","tpk","tpl","tpm","tpn","tpo","tpp","tpq","tpr","tpt","tpu","tpv","tpw","tpx","tpy","tpz","tqb","tql","tqm","tqn","tqo","tqp","tqq","tqr","tqt","tqu","tqw","tr","tra","trb","trc","trd","tre","trf","trg","trh","tri","trj","trk","trl","trm","trn","tro","trp","trq","trr","trs","trt","tru","trv","trw","trx","try","trz","ts","tsa","tsb","tsc","tsd","tse","tsf","tsg","tsh","tsi","tsj","tsk","tsl","tsm","tsp","tsq","tsr","tss","tst","tsu","tsv","tsw","tsx","tsy","tsz","tt","tta","ttb","ttc","ttd","tte","ttf","ttg","tth","tti","ttj","ttk","ttl","ttm","ttn","tto","ttp","ttq","ttr","tts","ttt","ttu","ttv","ttw","tty","ttz","tua","tub","tuc","tud","tue","tuf","tug","tuh","tui","tuj","tul","tum","tun","tuo","tup","tuq","tus","tut","tuu","tuv","tuw","tux","tuy","tuz","tva","tvd","tve","tvg","tvi","tvk","tvl","tvm","tvn","tvo","tvs","tvt","tvu","tvw","tvx","tvy","tw","twa","twb","twc","twd","twe","twf","twg","twh","twl","twm","twn","two","twp","twq","twr","twt","twu","tww","twx","twy","txa","txb","txc","txe","txg","txh","txi","txj","txm","txn","txo","txq","txr","txs","txt","txu","txx","txy","ty","tya","tye","tyh","tyi","tyj","tyl","tyn","typ","tyr","tys","tyt","tyu","tyv","tyx","tyy","tyz","tza","tzh","tzj","tzl","tzm","tzn","tzo","tzx","uam","uan","uar","uba","ubi","ubl","ubr","ubu","uby","uda","ude","udg","udi","udj","udl","udm","udu","ues","ufi","ug","uga","ugb","uge","ugh","ugn","ugo","ugy","uha","uhn","uis","uiv","uji","uk","uka","ukg","ukh","uki","ukk","ukl","ukp","ukq","uks","uku","ukv","ukw","uky","ula","ulb","ulc","ule","ulf","uli","ulk","ull","ulm","uln","ulu","ulw","uly","uma","umb","umc","umd","umg","umi","umm","umn","umo","ump","umr","ums","umu","una","une","ung","uni","unk","unm","unn","unp","unr","unu","unx","unz","uok","uon","upi","upv","ur","ura","urb","urc","ure","urf","urg","urh","uri","urj","urk","url","urm","urn","uro","urp","urr","urt","uru","urv","urw","urx","ury","urz","usa","ush","usi","usk","usp","uss","usu","uta","ute","uth","utp","utr","utu","uum","uun","uur","uuu","uve","uvh","uvl","uwa","uya","uz","uzn","uzs","vaa","vae","vaf","vag","vah","vai","vaj","val","vam","van","vao","vap","var","vas","vau","vav","vay","vbb","vbk","ve","vec","ved","vel","vem","veo","vep","ver","vgr","vgt","vi","vic","vid","vif","vig","vil","vin","vis","vit","viv","vjk","vka","vki","vkj","vkk","vkl","vkm","vkn","vko","vkp","vkt","vku","vkz","vlp","vls","vma","vmb","vmc","vmd","vme","vmf","vmg","vmh","vmi","vmj","vmk","vml","vmm","vmp","vmq","vmr","vms","vmu","vmv","vmw","vmx","vmy","vmz","vnk","vnm","vnp","vo","vor","vot","vra","vro","vrs","vrt","vsi","vsl","vsn","vsv","vto","vum","vun","vut","vwa","wa","waa","wab","wac","wad","wae","waf","wag","wah","wai","waj","wak","wal","wam","wan","wao","wap","waq","war","was","wat","wau","wav","waw","wax","way","waz","wba","wbb","wbe","wbf","wbh","wbi","wbj","wbk","wbl","wbm","wbp","wbq","wbr","wbs","wbt","wbv","wbw","wca","wci","wdd","wdg","wdj","wdk","wdt","wdu","wdy","wea","wec","wed","weg","weh","wei","wem","wen","weo","wep","wer","wes","wet","weu","wew","wfg","wga","wgb","wgg","wgi","wgo","wgu","wgw","wgy","wha","whg","whk","whu","wib","wic","wie","wif","wig","wih","wii","wij","wik","wil","wim","win","wir","wit","wiu","wiv","wiw","wiy","wja","wji","wka","wkb","wkd","wkl","wkr","wku","wkw","wky","wla","wlc","wle","wlg","wlh","wli","wlk","wll","wlm","wlo","wlr","wls","wlu","wlv","wlw","wlx","wly","wma","wmb","wmc","wmd","wme","wmg","wmh","wmi","wmm","wmn","wmo","wms","wmt","wmw","wmx","wnb","wnc","wnd","wne","wng","wni","wnk","wnm","wnn","wno","wnp","wnu","wnw","wny","wo","woa","wob","woc","wod","woe","wof","wog","woi","wok","wom","won","woo","wor","wos","wow","woy","wpc","wra","wrb","wrd","wrg","wrh","wri","wrk","wrl","wrm","wrn","wro","wrp","wrr","wrs","wru","wrv","wrw","wrx","wry","wrz","wsa","wsg","wsi","wsk","wsr","wss","wsu","wsv","wtb","wtf","wth","wti","wtk","wtm","wtw","wua","wub","wud","wuh","wul","wum","wun","wur","wut","wuu","wuv","wux","wuy","wwa","wwb","wwo","wwr","www","wxa","wxw","wya","wyb","wyi","wym","wyn","wyr","wyy","xaa","xab","xac","xad","xae","xag","xai","xaj","xak","xal","xam","xan","xao","xap","xaq","xar","xas","xat","xau","xav","xaw","xay","xba","xbb","xbc","xbd","xbe","xbg","xbi","xbj","xbm","xbn","xbo","xbp","xbr","xbw","xbx","xby","xcb","xcc","xce","xcg","xch","xcl","xcm","xcn","xco","xcr","xct","xcu","xcv","xcw","xcy","xda","xdc","xdk","xdm","xdo","xdq","xdy","xeb","xed","xeg","xel","xem","xep","xer","xes","xet","xeu","xfa","xga","xgb","xgd","xgf","xgg","xgi","xgl","xgm","xgn","xgr","xgu","xgw","xh","xha","xhc","xhd","xhe","xhm","xhr","xht","xhu","xhv","xia","xib","xii","xil","xin","xip","xir","xis","xiv","xiy","xjb","xjt","xka","xkb","xkc","xkd","xke","xkf","xkg","xkh","xki","xkj","xkk","xkl","xkn","xko","xkp","xkq","xkr","xks","xkt","xku","xkv","xkw","xkx","xky","xkz","xla","xlb","xlc","xld","xle","xlg","xli","xln","xlo","xlp","xls","xlu","xly","xma","xmb","xmc","xmd","xme","xmf","xmg","xmh","xmj","xmk","xml","xmm","xmn","xmo","xmp","xmq","xmr","xms","xmt","xmu","xmv","xmw","xmx","xmy","xmz","xna","xnb","xnd","xng","xnh","xni","xnj","xnk","xnm","xnn","xno","xnq","xnr","xns","xnt","xnu","xny","xnz","xoc","xod","xog","xoi","xok","xom","xon","xoo","xop","xor","xow","xpa","xpb","xpc","xpd","xpe","xpf","xpg","xph","xpi","xpj","xpk","xpl","xpm","xpn","xpo","xpp","xpq","xpr","xps","xpt","xpu","xpv","xpw","xpx","xpy","xpz","xqa","xqt","xra","xrb","xrd","xre","xrg","xri","xrm","xrn","xrq","xrr","xrt","xru","xrw","xsa","xsb","xsc","xsd","xse","xsh","xsi","xsj","xsl","xsm","xsn","xso","xsp","xsq","xsr","xss","xsu","xsv","xsy","xta","xtb","xtc","xtd","xte","xtg","xth","xti","xtj","xtl","xtm","xtn","xto","xtp","xtq","xtr","xts","xtt","xtu","xtv","xtw","xty","xtz","xua","xub","xud","xug","xuj","xul","xum","xun","xuo","xup","xur","xut","xuu","xve","xvi","xvn","xvo","xvs","xwa","xwc","xwd","xwe","xwg","xwj","xwk","xwl","xwo","xwr","xwt","xww","xxb","xxk","xxm","xxr","xxt","xya","xyb","xyj","xyk","xyl","xyt","xyy","xzh","xzm","xzp","yaa","yab","yac","yad","yae","yaf","yag","yah","yai","yaj","yak","yal","yam","yan","yao","yap","yaq","yar","yas","yat","yau","yav","yaw","yax","yay","yaz","yba","ybb","ybd","ybe","ybh","ybi","ybj","ybk","ybl","ybm","ybn","ybo","ybx","yby","ych","ycl","ycn","ycp","ycr","yda","ydd","yde","ydg","ydk","yds","yea","yec","yee","yei","yej","yel","yen","yer","yes","yet","yeu","yev","yey","yga","ygi","ygl","ygm","ygp","ygr","ygs","ygu","ygw","yha","yhd","yhl","yhs","yi","yia","yif","yig","yih","yii","yij","yik","yil","yim","yin","yip","yiq","yir","yis","yit","yiu","yiv","yix","yiy","yiz","yka","ykg","ykh","yki","ykk","ykl","ykm","ykn","yko","ykr","ykt","yku","yky","yla","ylb","yle","ylg","yli","yll","ylm","yln","ylo","ylr","ylu","yly","yma","ymb","ymc","ymd","yme","ymg","ymh","ymi","ymk","yml","ymm","ymn","ymo","ymp","ymq","ymr","yms","ymt","ymx","ymz","yna","ynb","ynd","yne","yng","ynh","ynk","ynl","ynn","yno","ynq","yns","ynu","yo","yob","yog","yoi","yok","yol","yom","yon","yos","yot","yox","yoy","ypa","ypb","ypg","yph","ypk","ypm","ypn","ypo","ypp","ypz","yra","yrb","yre","yri","yrk","yrl","yrm","yrn","yro","yrs","yrw","yry","ysc","ysd","ysg","ysl","ysm","ysn","yso","ysp","ysr","yss","ysy","yta","ytl","ytp","ytw","yty","yua","yub","yuc","yud","yue","yuf","yug","yui","yuj","yuk","yul","yum","yun","yup","yuq","yur","yut","yuu","yuw","yux","yuy","yuz","yva","yvt","ywa","ywg","ywl","ywn","ywq","ywr","ywt","ywu","yww","yxa","yxg","yxl","yxm","yxu","yxy","yyr","yyu","yyz","yzg","yzk","za","zaa","zab","zac","zad","zae","zaf","zag","zah","zai","zaj","zak","zal","zam","zao","zap","zaq","zar","zas","zat","zau","zav","zaw","zax","zay","zaz","zba","zbc","zbe","zbl","zbt","zbu","zbw","zca","zcd","zch","zdj","zea","zeg","zeh","zem","zen","zga","zgb","zgh","zgm","zgn","zgr","zh","zhb","zhd","zhi","zhk","zhn","zhw","zhx","zia","zib","zik","zil","zim","zin","zir","ziw","ziz","zka","zkb","zkd","zkg","zkh","zkk","zkn","zko","zkp","zkr","zkt","zku","zkv","zkz","zla","zle","zlj","zlm","zln","zlq","zls","zlu","zlw","zma","zmb","zmc","zmd","zme","zmf","zmg","zmh","zmi","zmj","zmk","zml","zmm","zmn","zmo","zmp","zmq","zmr","zms","zmt","zmu","zmv","zmw","zmx","zmy","zmz","zna","znd","zne","zng","znk","zns","zoc","zoh","zom","zoo","zoq","zor","zos","zpa","zpb","zpc","zpd","zpe","zpf","zpg","zph","zpi","zpj","zpk","zpl","zpm","zpn","zpo","zpp","zpq","zpr","zps","zpt","zpu","zpv","zpw","zpx","zpy","zpz","zqe","zra","zrg","zrn","zro","zrp","zrs","zsa","zsk","zsl","zsm","zsr","zsu","zte","ztg","ztl","ztm","ztn","ztp","ztq","zts","ztt","ztu","ztx","zty","zu","zua","zuh","zum","zun","zuy","zwa","zyb","zyg","zyj","zyn","zyp","zza","zzj"],"script":["adlm","afak","aghb","ahom","arab","aran","armi","armn","avst","bali","bamu","bass","batk","beng","berf","bhks","blis","bopo","brah","brai","bugi","buhd","cakm","cans","cari","cham","cher","chis","chrs","cirt","copt","cpmn","cprt","cyrl","cyrs","deva","diak","dogr","dsrt","dupl","egyd","egyh","egyp","elba","elym","ethi","gara","geok","geor","glag","gong","gonm","goth","gran","grek","gujr","gukh","guru","hanb","hang","hani","hano","hans","hant","hatr","hebr","hira","hluw","hmng","hmnp","hntl","hrkt","hung","inds","ital","jamo","java","jpan","jurc","kali","kana","kawi","khar","khmr","khoj","kitl","kits","knda","kore","kpel","krai","kthi","lana","laoo","latf","latg","latn","leke","lepc","limb","lina","linb","lisu","loma","lyci","lydi","mahj","maka","mand","mani","marc","maya","medf","mend","merc","mero","mlym","modi","mong","moon","mroo","mtei","mult","mymr","nagm","nand","narb","nbat","newa","nkdb","nkgb","nkoo","nshu","ogam","olck","onao","orkh","orya","osge","osma","ougr","palm","pauc","pcun","pelm","perm","phag","phli","phlp","phlv","phnx","piqd","plrd","prti","psin","ranj","rjng","rohg","roro","runr","samr","sara","sarb","saur","seal","sgnw","shaw","shrd","shui","sidd","sidt","sind","sinh","sogd","sogo","sora","soyo","sund","sunu","sylo","syrc","syre","syrj","syrn","tagb","takr","tale","talu","taml","tang","tavt","tayo","telu","teng","tfng","tglg","thaa","thai","tibt","tirh","tnsa","todr","tols","toto","tutg","ugar","vaii","visp","vith","wara","wcho","wole","xpeo","xsux","yezi","yiii","zanb","zinh","zmth","zsye","zsym","zxxx"],"region":["001","002","003","005","009","011","013","014","015","017","018","019","021","029","030","034","035","039","053","054","057","061","142","143","145","150","151","154","155","202","419","ac","ad","ae","af","ag","ai","al","am","an","ao","aq","ar","as","at","au","aw","ax","az","ba","bb","bd","be","bf","bg","bh","bi","bj","bl","bm","bn","bo","bq","br","bs","bt","bu","bv","bw","by","bz","ca","cc","cd","cf","cg","ch","ci","ck","cl","cm","cn","co","cp","cq","cr","cs","cu","cv","cw","cx","cy","cz","dd","de","dg","dj","dk","dm","do","dz","ea","ec","ee","eg","eh","er","es","et","eu","ez","fi","fj","fk","fm","fo","fr","fx","ga","gb","gd","ge","gf","gg","gh","gi","gl","gm","gn","gp","gq","gr","gs","gt","gu","gw","gy","hk","hm","hn","hr","ht","hu","ic","id","ie","il","im","in","io","iq","ir","is","it","je","jm","jo","jp","ke","kg","kh","ki","km","kn","kp","kr","kw","ky","kz","la","lb","lc","li","lk","lr","ls","lt","lu","lv","ly","ma","mc","md","me","mf","mg","mh","mk","ml","mm","mn","mo","mp","mq","mr","ms","mt","mu","mv","mw","mx","my","mz","na","nc","ne","nf","ng","ni","nl","no","np","nr","nt","nu","nz","om","pa","pe","pf","pg","ph","pk","pl","pm","pn","pr","ps","pt","pw","py","qa","re","ro","rs","ru","rw","sa","sb","sc","sd","se","sg","sh","si","sj","sk","sl","sm","sn","so","sr","ss","st","su","sv","sx","sy","sz","ta","tc","td","tf","tg","th","tj","tk","tl","tm","tn","to","tp","tr","tt","tv","tw","tz","ua","ug","um","un","us","uy","uz","va","vc","ve","vg","vi","vn","vu","wf","ws","yd","ye","yt","yu","za","zm","zr","zw"],"variant":["1606nict","1694acad","1901","1959acad","1994","1996","abl1943","akhmimic","akuapem","alalc97","aluku","anpezo","ao1990","aranes","arevela","arevmda","arkaika","asante","auvern","baku1926","balanka","barla","basiceng","bauddha","bciav","bcizbl","biscayan","biske","blasl","bohairic","bohoric","boont","bornholm","cisaup","colb1945","cornu","creiss","dajnko","ekavsk","emodeng","fascia","fayyumic","fodom","fonipa","fonkirsh","fonnapa","fonupa","fonxsamp","gallo","gascon","gherd","grclass","grital","grmistr","hanoi","hepburn","heploc","hognorsk","hsistemo","huett","ijekavsk","itihasa","ivanchov","jauer","jyutping","kkcor","kleinsch","kociewie","kscor","laukika","leidentr","lemosin","lengadoc","lipaw","ltg1929","ltg2007","luna1918","lycopol","mdcegyp","mdctrans","mesokem","metelko","moderat","monoton","ndyuka","nedis","newfound","nicard","njiva","nulik","osojs","oxendict","pahawh2","pahawh3","pahawh4","pamaka","peano","pehoeji","petr1708","pinyin","polyton","provenc","puter","radikalt","rigik","rozaj","rumgr","sahidic","saigon","scotland","scouse","simple","slepe","solba","sotav","spanglis","stadi","surmiran","sursilv","sutsilv","synnejyl","taglish","tailo","tarask","tongyong","tunumiit","uccor","ucrcor","ulster","unifon","vaidika","valbadia","valencia","vallader","vecdruka","viennese","vivaraup","wadegile","xsistemo"]};
const LANGUAGE = new Set(languageSubtags.language);
const SCRIPT = new Set(languageSubtags.script);
const REGION = new Set(languageSubtags.region);
const VARIANT = new Set(languageSubtags.variant);

/**
 * Parses the CORE of a BCP 47 (RFC 5646) tag — `language ["-" script] ["-" region] *("-" variant)`
 * — checking each subtag against the real IANA Language Subtag Registry, not just its shape.
 * Deliberately does NOT handle `extlang`, extension singletons (`-u-...`, `-t-...`), private use
 * (`x-...`) or the 26 fixed `grandfathered` tags: none has a real use case for "what language is
 * this event's text in", and `grandfathered` tags are relics RFC 5646 itself deprecates in favor
 * of the modern subtag form. See docs/history/CHANGES.log #P006 / DECISIONS.md D007.
 *
 * Returns null if the tag doesn't parse; a well-formed tag with an unregistered subtag also
 * returns null — e.g. "en-12345678" is 8 alphanumeric characters, which the grammar's own
 * `5*8alphanum` variant form permits regardless of leading digit (contrary to a first read of
 * the ABNF, only the SEPARATE 4-character `DIGIT 3alphanum` form is digit-led-and-length-4); it
 * fails only because "12345678" was never registered as an actual variant.
 */
function parseCoreLanguageTag(value) {
  if (typeof value !== "string" || value === "") return null;
  const parts = value.split("-");

  const language = parts[0].toLowerCase();
  if (!/^[a-z]{2,8}$/.test(language) || !LANGUAGE.has(language)) return null;

  let i = 1;
  let script = null;
  if (i < parts.length && /^[A-Za-z]{4}$/.test(parts[i])) {
    const candidate = parts[i].toLowerCase();
    if (!SCRIPT.has(candidate)) return null;
    script = candidate;
    i++;
  }

  let region = null;
  if (i < parts.length && /^([A-Za-z]{2}|\d{3})$/.test(parts[i])) {
    const candidate = parts[i].toLowerCase();
    if (!REGION.has(candidate)) return null;
    region = candidate;
    i++;
  }

  const variants = [];
  while (i < parts.length) {
    if (!/^([A-Za-z0-9]{5,8}|\d[A-Za-z0-9]{3})$/.test(parts[i])) return null;
    const candidate = parts[i].toLowerCase();
    if (!VARIANT.has(candidate) || variants.includes(candidate)) return null;
    variants.push(candidate);
    i++;
  }

  return { language, script, region, variants };
}

function isOteLanguageTag(value) {
  return parseCoreLanguageTag(value) !== null;
}

/**
 * JSON Schema's `iri` format is the Unicode sibling of `uri`: the web address a person actually
 * publishes may carry non-ASCII characters such as `ñ` or `á`. The schemas still pair it with
 * an explicit `^https?://` pattern wherever OTE wants web URLs only.
 */
function isIri(value) {
  if (typeof value !== "string" || /[\u0000-\u0020<>"]/.test(value)) return false;
  try {
    new URL(encodeURI(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Formats the schemas use beyond what ajv-formats provides. Ajv's strict mode refuses to
 * compile a schema referencing an unregistered format, so register these before compiling —
 * the same requirement `annotationKeywords` already has, for the same reason:
 *
 *   for (const f of customFormats) ajv.addFormat(f.name, f.validate);
 */
export const customFormats = [
  { name: "iri", validate: isIri },
  { name: "ote-local-date-time", validate: isOteLocalDateTime },
  { name: "ote-language-tag", validate: isOteLanguageTag },
];

/**
 * `$defs.event`'s own constraint: `endDate`, when present, must not be earlier than `startDate`.
 * Both are wall-clock strings of the same form (the schema's own `oneOf` already guarantees
 * that) and, since `dateTime` forbids seconds, always the same fixed width — so ordinary string
 * comparison already matches chronological order, no timezone conversion needed.
 *
 * Unlike `annotationKeywords`, this keyword DOES restrict which documents pass — register it
 * the same way, before compiling:
 *
 *   for (const kw of customKeywords) ajv.addKeyword(kw);
 */
/**
 * `$defs.offer` and `$defs.cfp` share this constraint: `closesAt`, when both it and `opensAt`
 * exist, must not be an instant earlier than `opensAt`. Unlike `orderedDates`, these are
 * `$defs.instant` values — real points in time WITH a mandatory offset, and deliberately not
 * forced to a single one (UTC or otherwise): the offset is whatever the producing system or
 * organiser naturally writes, and forcing a conversion would repeat the exact authoring burden
 * D003 already rejected for `startDate`. Two instants with different offsets can have a string
 * order that disagrees with their real chronological order, so — unlike `orderedDates`, where
 * the fixed-width wall-clock form makes string comparison safe — this parses both values and
 * compares the actual instants.
 */
function parseInstant(value) {
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : time;
}

/**
 * A `translations` map's own constraint, shared by every keyword that walks the same five nested
 * locations (`distinctTranslationLanguages`, `eventsRespectInheritedTextLanguage`; P009/P015/P026):
 * no key may equal the primary language, and no two keys of the SAME map may be that language
 * written with different case. RFC 5646 §2.1.1 compares BCP 47 tags case-insensitively, so
 * "en-US" and "EN-us" are one language wearing two keys — the same contradiction the
 * key-equals-primary check already forbids, just between two translation entries instead of one
 * translation entry and the primary text. `primary` may be `null` (no effective language to
 * compare against yet — a different keyword's job to require one where needed); the
 * within-a-map duplicate check still applies regardless.
 */
function translationMapsAreDistinct(maps, primary) {
  return maps.every((map) => {
    const keys = Object.keys(map).map((k) => k.toLowerCase());
    if (primary !== null && keys.includes(primary)) return false;
    return new Set(keys).size === keys.length;
  });
}

export const customKeywords = [
  {
    keyword: "orderedDates",
    type: "object",
    schemaType: "boolean",
    validate: (schemaValue, data) =>
      !schemaValue || typeof data.endDate !== "string" || data.endDate >= data.startDate,
    error: { message: "endDate must not be earlier than startDate" },
  },
  {
    keyword: "orderedInstants",
    type: "object",
    schemaType: "boolean",
    validate: (schemaValue, data) => {
      if (!schemaValue || typeof data.opensAt !== "string" || typeof data.closesAt !== "string") {
        return true;
      }
      const opensAt = parseInstant(data.opensAt);
      const closesAt = parseInstant(data.closesAt);
      return opensAt === null || closesAt === null || closesAt >= opensAt;
    },
    error: { message: "closesAt must not be earlier than opensAt" },
  },
  {
    keyword: "distinctTranslationLanguages",
    type: "object",
    schemaType: "boolean",
    /**
     * No `translations` map — the event's own, or one nested in `eligibility`, `partOf`, each
     * `offers[]` or each `image[]` — may carry a key equal to `textLanguage`, the document's own
     * language: that would be a second, possibly contradictory version of the same text under
     * the same language tag, which the field's own description already promises cannot happen.
     * Same set of nested locations already enumerated by the sibling rule that REQUIRES
     * textLanguage wherever any of these maps exists (see `$defs.event`'s own `allOf`) — this
     * adds two things: that the language it requires can't also be a translation key, and (P026)
     * that no SINGLE map can carry two keys naming that same language in different case
     * ("en-US" and "EN-us") — JSON sees distinct object keys, RFC 5646 §2.1.1 sees one language
     * claimed twice, contradicting itself with no way for a consumer to know which entry to trust.
     * `translationMapsAreDistinct` covers both; a map missing entirely is filtered out first, same
     * as before.
     */
    validate: (schemaValue, data) => {
      if (!schemaValue) return true;
      const primary = typeof data.textLanguage === "string" ? data.textLanguage.toLowerCase() : null;
      const maps = [
        data.translations,
        data.eligibility?.translations,
        data.partOf?.translations,
        ...(Array.isArray(data.offers) ? data.offers.map((o) => o?.translations) : []),
        ...(Array.isArray(data.image) ? data.image.map((i) => i?.translations) : []),
      ].filter((map) => map && typeof map === "object");
      return translationMapsAreDistinct(maps, primary);
    },
    error: {
      message:
        "a translations map must not repeat textLanguage's own language, or any of its own keys, twice",
    },
  },
  {
    keyword: "uniqueEventIds",
    type: "object",
    schemaType: "boolean",
    /**
     * `feed.events`' own constraint: no two events in the same feed may share an `id`. `id` is
     * "minted once, never rewritten — this is what lets consumers update an event instead of
     * duplicating it"; two events under the same `id` in one document is that promise broken by
     * the very document that made it, not the cross-source deduplication this spec deliberately
     * leaves unsolved (a different feed reusing a URL is not this keyword's problem). Compares
     * `id` by exact string equality only — no URI normalization, no inferring that two different
     * identifiers name the same event. `uniqueItems` can't express this: it compares whole event
     * objects, and two events sharing an `id` typically differ in every other field too.
     */
    validate: (schemaValue, data) => {
      if (!schemaValue || !Array.isArray(data.events)) return true;
      const ids = data.events.map((e) => e?.id).filter((id) => typeof id === "string");
      return new Set(ids).size === ids.length;
    },
    error: { message: "events must not repeat the same id" },
  },
  {
    keyword: "distinctPartOfId",
    type: "object",
    schemaType: "boolean",
    /**
     * `$defs.event`'s own constraint: `partOf.id`, when present, must not equal the event's own
     * `id` — an occurrence cannot be the series it belongs to. Same exact-string-equality scope
     * as `uniqueEventIds` (D011): no URI normalization, no inferring equivalence between
     * differently-written identifiers. Deliberately narrower than "no event's partOf.id may
     * equal another event's id in the feed" — that would forbid a legitimate cross-reference (an
     * occurrence pointing at the real event that IS its series); this only forbids an entity
     * being its own parent, which is incoherent by construction, not a judgment call.
     */
    validate: (schemaValue, data) =>
      !schemaValue || typeof data.partOf?.id !== "string" || data.partOf.id !== data.id,
    error: { message: "partOf.id must not equal the event's own id" },
  },
  {
    keyword: "eventsNotNewerThanFeed",
    type: "object",
    schemaType: "boolean",
    /**
     * `feed`'s own constraint: no event's `updatedAt` may be a later instant than the feed's own
     * `updatedAt` — "when this feed was generated" cannot be earlier than a revision it already
     * contains. Reuses `parseInstant` (same as `orderedInstants`, P008): RFC 3339 §5.1 only
     * guarantees string comparison matches chronological order when zone, offset representation
     * and fractional-second precision all match, none of which `$defs.instant` requires — so this
     * compares real instants, never the serialized text. Events without `updatedAt` are
     * unconstrained (absence means unknown, not "unchanged"); equality is allowed.
     */
    validate: (schemaValue, data) => {
      if (!schemaValue || typeof data.updatedAt !== "string" || !Array.isArray(data.events)) {
        return true;
      }
      const feedUpdatedAt = parseInstant(data.updatedAt);
      if (feedUpdatedAt === null) return true;
      return data.events.every((e) => {
        if (typeof e?.updatedAt !== "string") return true;
        const eventUpdatedAt = parseInstant(e.updatedAt);
        return eventUpdatedAt === null || eventUpdatedAt <= feedUpdatedAt;
      });
    },
    error: { message: "no event may be updated after the feed itself was generated" },
  },
  {
    keyword: "eventsRespectInheritedTextLanguage",
    type: "object",
    schemaType: "boolean",
    /**
     * `feed`'s own constraint: `$defs.event`'s shared schema evaluates each event against its own
     * instance location only, with no visibility into the enclosing feed — the same reason
     * `uniqueEventIds` and `eventsNotNewerThanFeed` (P010/P014) had to live here instead of in
     * `$defs.event`. That schema's `required: ["textLanguage"]` when any translations map exists
     * is therefore only enforced for a STANDALONE event document (moved to event.schema.json's
     * root `allOf`, which has no feed to inherit from); an event embedded in a feed must be judged
     * against its EFFECTIVE language, `event.textLanguage ?? feed.textLanguage`
     * (`x-inheritsFrom`), which only the feed root can compute. This single keyword covers both
     * halves of that check for every embedded event: the effective language must exist wherever a
     * translations map does (event's own, or nested in eligibility, partOf, each offers[] or each
     * image[] — same five locations as `distinctTranslationLanguages`), and no such map's key may
     * equal it, case-insensitively (RFC 5646 §2.1.1) — nor may two keys of the SAME map name that
     * effective language in different case (P026): the inherited case is exactly as capable of
     * this contradiction as the local one `distinctTranslationLanguages` already covers, and
     * without this an event that omits its own textLanguage was the one shape where it slipped
     * through. See docs/history/CHANGES.log #P015 / DECISIONS.md D016.
     */
    validate: (schemaValue, data) => {
      if (!schemaValue || !Array.isArray(data.events)) return true;
      return data.events.every((event) => {
        if (!event || typeof event !== "object") return true;
        const effectiveTextLanguage =
          typeof event.textLanguage === "string" ? event.textLanguage : data.textLanguage;
        const maps = [
          event.translations,
          event.eligibility?.translations,
          event.partOf?.translations,
          ...(Array.isArray(event.offers) ? event.offers.map((o) => o?.translations) : []),
          ...(Array.isArray(event.image) ? event.image.map((i) => i?.translations) : []),
        ].filter((map) => map && typeof map === "object");

        if (maps.length === 0) return true;
        if (typeof effectiveTextLanguage !== "string") return false;

        return translationMapsAreDistinct(maps, effectiveTextLanguage.toLowerCase());
      });
    },
    error: {
      message:
        "every event's translations must have an effective textLanguage (own or inherited from the feed) and must not repeat it",
    },
  },
  {
    keyword: "languagesCoveredByText",
    type: "object",
    schemaType: "boolean",
    /**
     * `event.recommended.schema.json`'s own constraint: `languages` (what is SPOKEN at the event)
     * says nothing about whether the event's own text is available in each of those languages —
     * a bilingual session described in only one of them is valid by design (`$defs.event`'s own
     * `languages` description gives exactly that example). But it is a discoverability gap worth
     * a warning: someone who only reads a language in `languages` with no matching text has
     * nothing to read. "Available text" is the effective `textLanguage` (own, or the feed's via
     * `asPublished` in `scripts/validate.mjs` — this keyword itself only ever sees whichever value
     * is already on `data`, exactly like `distinctTranslationLanguages`) plus every key of the
     * event's own `translations` — never a nested translations map (`offers[]`, `image[]`, …),
     * which translates a different piece of text, not the event's main name/description.
     * Comparison is case-insensitive, exact BCP 47 tags only (RFC 5646 §2.1.1) — no attempt to
     * treat a region- or script-qualified tag as covering its bare language, matching the same
     * mechanical, explainable precision D007 already chose for tag validation itself. If there is
     * no available text at all (no effective `textLanguage`, no `translations`), this stays
     * silent rather than warn: `README.md`'s own reasoning for why `textLanguage` is not
     * recommended on its own (an `.ics` importer never has it, and inventing one is worse than
     * omitting it) would otherwise be defeated by the back door. See docs/history/CHANGES.log #P019 /
     * DECISIONS.md D019.
     */
    validate: (schemaValue, data) => {
      if (!schemaValue || !Array.isArray(data.languages)) return true;
      const available = new Set();
      if (typeof data.textLanguage === "string") available.add(data.textLanguage.toLowerCase());
      if (data.translations && typeof data.translations === "object") {
        for (const key of Object.keys(data.translations)) available.add(key.toLowerCase());
      }
      if (available.size === 0) return true;
      return data.languages.every(
        (lang) => typeof lang !== "string" || available.has(lang.toLowerCase())
      );
    },
    error: { message: "languages should be covered by the effective textLanguage or a translations key" },
  },
  {
    keyword: "distinctLanguageTags",
    type: "array",
    schemaType: "boolean",
    /**
     * `languages`' own constraint: `uniqueItems` already rejects a byte-identical repeat, but RFC
     * 5646 §2.1.1 compares BCP 47 tags case-insensitively, so ["es","ES"] names the same spoken
     * language twice under a JSON-distinct pair of strings — the same contradiction
     * `distinctTranslationLanguages`/D010 and its D023 extension already treat as invalid for
     * `translations` keys, applied here to the other field sharing `$defs.languageTag`. Deliberately
     * narrow, same boundary as D010/D023: detects only the same tag written with different case,
     * never infers that two DIFFERENT tags (a regional variant, an alias, a macrolanguage) name the
     * same language — "pt" and "pt-BR" stay distinct. Lives on the `languages` property itself, not
     * the whole event object, so a failure reports at `/languages` without needing the
     * `OBJECT_KEYWORD_FIELD` lookup `languagesCoveredByText` needed. See docs/history/CHANGES.log #P031 /
     * DECISIONS.md D028.
     */
    validate: (schemaValue, data) => {
      if (!schemaValue || !Array.isArray(data)) return true;
      const tags = data.filter((lang) => typeof lang === "string").map((lang) => lang.toLowerCase());
      return new Set(tags).size === tags.length;
    },
    error: { message: "languages must not repeat the same language tag under different case" },
  },
];
