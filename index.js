const root = document.getElementById("root");

const diseaseInfo = {
    BRVO: "视网膜分支静脉阻塞（Branch Retinal Vein Occlusion）",
    ARN: "急性视网膜坏死症（Acute Retinal Necrosis）",
    VKH: "Vogt-Koyanagi-Harada综合症",
    CSC: "中心性脉络膜性脉络膜病变（Central Serous Chorioretinopathy）",
    DR: "糖尿病性视网膜病变（Diabetic Retinopathy）",
    AMD: "年龄相关性黄斑变性（Age-Related Macular Degeneration）",
    ERM: "黄斑前膜（Epiretinal Membrane）",
    MH: "黄斑裂孔（Macular Hole）",
    "Retinal breaks": "视网膜裂孔",
    RP: "视网膜色素变性（Retinitis Pigmentosa）",
    MOCD: "视盘旁色素细胞瘤（Melanocytoma of the Optic Disc）",
    RD: "视网膜脱离（Retinal Detachment）",
    FEVR: "家族性渗出性视网膜毛细血管扩张症（Familial Exudative Vitreoretinopathy）",
    Coats: "Coats病",
    VPTR: "视网膜血管增生性肿瘤（Vasoproliferative Tumors of the Retina）",
    RB: "视网膜母细胞瘤（Retinoblastoma）",
    PM: "病理性近视（Pathological myopia）",
    TB: "结核病（Tuberculosis）",
    CHRP: "先天性视网膜色素上皮肥大症（Congenital Hypertrophy of the Retinal Pigmented Epithelium）",
    VHL: "Von Hippel-Lindau病",
};

let tableContent = "<table><tr><th>疾病</th><th>英文缩写</th></tr>";
for (const key in diseaseInfo) {
    tableContent += `<tr><td>${diseaseInfo[key]}</td><td>${key}</td></tr>`;
}
tableContent += "</table>";
root.innerHTML = tableContent;
