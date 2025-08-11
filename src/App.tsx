import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const fmt = (n:number) => BRL.format(n || 0);

const DEFAULT_CATEGORIES = [
  "Poupança","Energia","Agua","Celular","Internet casa","Prest Casa","Cond Casa","Cond Lote",
  "Escola JG e Marina","Casa Caldas","Mae","Vó","Diversos","Mercado AV","Jardinagem",
  "Escolinha +Personal Fut JG","Cartão XP","Cartão Bradesco","Cartão Nub","IPTU"
];

const SEED = {
  budgets: {
    "2025-07": {
      "Energia": 508, "Agua": 250, "Celular": 115, "Internet casa": 85, "Prest Casa": 1000,
      "Cond Casa": 573, "Cond Lote": 573, "Escola JG e Marina": 2875, "Casa Caldas": 350,
      "Mae": 345.55, "Vó": 130, "Diversos": 1200, "Jardinagem": 250, "Escolinha +Personal Fut JG": 140,
      "Cartão XP": 9600, "Cartão Bradesco": 4000, "Cartão Nub": 490
    },
  },
  transactions: [
    { id: "t1", date: "2025-07-31", month: "2025-07", category: "Energia", type: "Despesa", description: "Conta luz", amount: 508 },
    { id: "t2", date: "2025-07-31", month: "2025-07", category: "Agua", type: "Despesa", description: "Conta água", amount: 250 },
    { id: "t3", date: "2025-07-31", month: "2025-07", category: "Celular", type: "Despesa", description: "Plano móvel", amount: 115 },
    { id: "t4", date: "2025-07-31", month: "2025-07", category: "Internet casa", type: "Despesa", description: "Banda larga", amount: 85 },
    { id: "t5", date: "2025-07-31", month: "2025-07", category: "Prest Casa", type: "Despesa", description: "Prestação", amount: 1000 },
    { id: "t6", date: "2025-07-31", month: "2025-07", category: "Cond Casa", type: "Despesa", description: "Condomínio", amount: 573 },
    { id: "t7", date: "2025-07-31", month: "2025-07", category: "Cond Lote", type: "Despesa", description: "Condomínio lote", amount: 573 },
    { id: "t8", date: "2025-07-31", month: "2025-07", category: "Escola JG e Marina", type: "Despesa", description: "Mensalidade", amount: 2875 },
    { id: "t9", date: "2025-07-31", month: "2025-07", category: "Casa Caldas", type: "Despesa", description: "Contas Caldas", amount: 350 },
    { id: "t10", date: "2025-07-31", month: "2025-07", category: "Mae", type: "Despesa", description: "Ajuda", amount: 345.55 },
    { id: "t11", date: "2025-07-31", month: "2025-07", category: "Vó", type: "Despesa", description: "Ajuda", amount: 130 },
    { id: "t12", date: "2025-07-31", month: "2025-07", category: "Diversos", type: "Despesa", description: "Vários", amount: 1200 },
    { id: "t13", date: "2025-07-31", month: "2025-07", category: "Jardinagem", type: "Despesa", description: "Serviço", amount: 250 },
    { id: "t14", date: "2025-07-31", month: "2025-07", category: "Escolinha +Personal Fut JG", type: "Despesa", description: "Mensalidade", amount: 140 },
    { id: "t15", date: "2025-07-31", month: "2025-07", category: "Cartão XP", type: "Despesa", description: "Fatura", amount: 9600 },
    { id: "t16", date: "2025-07-31", month: "2025-07", category: "Cartão Bradesco", type: "Despesa", description: "Fatura", amount: 4000 },
    { id: "t17", date: "2025-07-31", month: "2025-07", category: "Cartão Nub", type: "Despesa", description: "Fatura", amount: 490 },
    { id: "r1", date: "2025-07-05", month: "2025-07", category: "Receita", type: "Receita", description: "Receita", amount: 22500 },

    { id: "t18", date: "2025-08-31", month: "2025-08", category: "Energia", type: "Despesa", description: "Conta luz", amount: 361 },
    { id: "t19", date: "2025-08-31", month: "2025-08", category: "Agua", type: "Despesa", description: "Conta água", amount: 300 },
    { id: "t20", date: "2025-08-31", month: "2025-08", category: "Celular", type: "Despesa", description: "Plano móvel", amount: 100 },
    { id: "t21", date: "2025-08-31", month: "2025-08", category: "Internet casa", type: "Despesa", description: "Banda larga", amount: 85 },
    { id: "t22", date: "2025-08-31", month: "2025-08", category: "Prest Casa", type: "Despesa", description: "Prestação", amount: 1100 },
    { id: "t23", date: "2025-08-31", month: "2025-08", category: "Cond Casa", type: "Despesa", description: "Condomínio", amount: 573 },
    { id: "t24", date: "2025-08-31", month: "2025-08", category: "Cond Lote", type: "Despesa", description: "Condomínio lote", amount: 573 },
    { id: "t25", date: "2025-08-31", month: "2025-08", category: "Escola JG e Marina", type: "Despesa", description: "Mensalidade", amount: 2875 },
    { id: "t26", date: "2025-08-31", month: "2025-08", category: "Casa Caldas", type: "Despesa", description: "Contas Caldas", amount: 188 },
    { id: "t27", date: "2025-08-31", month: "2025-08", category: "Mae", type: "Despesa", description: "Ajuda", amount: 345.55 },
    { id: "t28", date: "2025-08-31", month: "2025-08", category: "Vó", type: "Despesa", description: "Ajuda", amount: 130 },
    { id: "t29", date: "2025-08-31", month: "2025-08", category: "Diversos", type: "Despesa", description: "Vários", amount: 1200 },
    { id: "t30", date: "2025-08-31", month: "2025-08", category: "Jardinagem", type: "Despesa", description: "Serviço", amount: 250 },
    { id: "t31", date: "2025-08-31", month: "2025-08", category: "Escolinha +Personal Fut JG", type: "Despesa", description: "Mensalidade", amount: 140 },
    { id: "t32", date: "2025-08-31", month: "2025-08", category: "Cartão XP", type: "Despesa", description: "Fatura", amount: 13040 },
    { id: "t33", date: "2025-08-31", month: "2025-08", category: "Cartão Bradesco", type: "Despesa", description: "Fatura", amount: 7572 },
    { id: "t34", date: "2025-08-31", month: "2025-08", category: "Cartão Nub", type: "Despesa", description: "Fatura", amount: 425 },
    { id: "r2", date: "2025-08-05", month: "2025-08", category: "Receita", type: "Receita", description: "Receita", amount: 21000 },
  ]
};

function useLocalStorage<T>(key:string, initial:T){
  const [value,setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch { return initial; }
  });
  useEffect(()=>{
    localStorage.setItem(key, JSON.stringify(value));
  },[key, value]);
  return [value,setValue] as const;
}

export default function App(){
  const [categories, setCategories] = useLocalStorage<string[]>("gms.categories", DEFAULT_CATEGORIES);
  const [transactions, setTransactions] = useLocalStorage<any[]>("gms.transactions", SEED.transactions);
  const [budgets, setBudgets] = useLocalStorage<Record<string, Record<string, number>>>("gms.budgets", SEED.budgets);
  const [month, setMonth] = useLocalStorage<string>("gms.month", "2025-08");
  const [newMonth, setNewMonth] = useState<string>(month);
  const [tab, setTab] = useState<"resumo"|"lancamentos"|"detalhes"|"config">("resumo");

  const months = useMemo(()=>{
    const s = new Set<string>();
    Object.keys(budgets||{}).forEach(m=>s.add(m));
    (transactions||[]).forEach(t=> s.add(t.month));
    return Array.from(s).sort();
  },[budgets, transactions]);

  const monthTx = useMemo(()=> transactions.filter(t => t.month===month), [transactions, month]);

  const incomeSum = useMemo(()=> monthTx.filter(t=>t.type==="Receita").reduce((a,b)=>a+Number(b.amount||0),0), [monthTx]);
  const expenseSum = useMemo(()=> monthTx.filter(t=>t.type==="Despesa").reduce((a,b)=>a+Number(b.amount||0),0), [monthTx]);
  const saldo = incomeSum - expenseSum;

  const realizedByCat = useMemo(()=>{
    const m: Record<string, number> = {};
    for(const c of categories) m[c]=0;
    for(const t of monthTx){ if(t.type === "Despesa") m[t.category] = (m[t.category]||0) + Number(t.amount||0); }
    return m;
  },[monthTx, categories]);

  const monthBudget = budgets[month] || {};
  const pieData = Object.entries(realizedByCat).filter(([_,v])=> v>0).map(([name, value])=>({ name, value }));

  const summaryRows = categories.map(cat => ({
    category: cat,
    budget: monthBudget?.[cat] || 0,
    realized: realizedByCat?.[cat] || 0,
    diff: (monthBudget?.[cat] || 0) - (realizedByCat?.[cat] || 0),
  }));

  const addTransaction = (t:any) => setTransactions(prev => [...prev, { ...t, id: crypto.randomUUID() }]);
  const removeTransaction = (id:string) => setTransactions(prev => prev.filter(x=>x.id!==id));
  const setBudgetFor = (cat:string, value:number) => {
    setBudgets(prev => ({ ...prev, [month]: { ...(prev[month]||{}), [cat]: value } }));
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ categories, transactions, budgets }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `orcamento-${month}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file:File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try{
        const obj = JSON.parse(String(reader.result));
        if(obj.categories) setCategories(obj.categories);
        if(obj.transactions) setTransactions(obj.transactions);
        if(obj.budgets) setBudgets(obj.budgets);
      }catch(_e){ alert("Arquivo inválido"); }
    };
    reader.readAsText(file);
  };

  const openNewMonth = () => {
    if(!newMonth) return;
    setBudgets(prev => ({ ...prev, [newMonth]: prev[newMonth] || {} }));
    setMonth(newMonth);
  };

  const [detailType, setDetailType] = useState<"Despesa"|"Receita">("Despesa");
  const [detailCat, setDetailCat] = useState<string>(categories[0]||"");
  useEffect(()=>{ if(!categories.includes(detailCat) && categories.length>0) setDetailCat(categories[0]); },[categories]);
  const detailTx = useMemo(()=> monthTx.filter(t=> t.type===detailType && t.category===detailCat), [monthTx, detailType, detailCat]);
  const detailTotal = useMemo(()=> detailTx.reduce((a,b)=> a + Number(b.amount||0), 0), [detailTx]);

  return (
    <div className="container">
      <div className="header" style={{rowGap:8}}>
        <h1>Orçamento x Realizado</h1>
        <div className="controls">
          <input type="month" value={month} onChange={(e)=>setMonth((e.target as HTMLInputElement).value)} />
          <button onClick={exportData} title="Exportar dados">Exportar</button>
          <label>Importar
            <input type="file" accept="application/json" onChange={(e)=>{
              const f = (e.target as HTMLInputElement).files?.[0];
              if(f) importData(f);
            }} />
          </label>
        </div>
      </div>

      <div className="card" style={{marginTop:8}}>
        <div className="title">Meses</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          {months.map(m => (
            <button key={m} onClick={()=>setMonth(m)} style={{padding:"6px 10px",borderRadius:999,border:"1px solid #26335b",background: m===month?"#24325f":"#17213f",color:"#eaf0ff"}}>{m}</button>
          ))}
          <span style={{marginLeft:8}} />
          <input type="month" value={newMonth} onChange={(e)=>setNewMonth((e.target as HTMLInputElement).value)} />
          <button className="primary" onClick={openNewMonth}>Abrir novo mês</button>
        </div>
      </div>

      <div className="row">
        <div className="card">
          <div className="title">Receitas</div>
          <div className="big">{fmt(incomeSum)}</div>
        </div>
        <div className="card">
          <div className="title">Despesas</div>
          <div className="big">{fmt(expenseSum)}</div>
        </div>
        <div className="card">
          <div className="title">Saldo</div>
          <div className="big" style={{color: saldo<0? "#ff8080" : "#7CFFB2"}}>{fmt(saldo)}</div>
        </div>
      </div>

      <div className="tabs">
        <button className="tabbtn" aria-selected={tab==="resumo"} onClick={()=>setTab("resumo")}>Resumo</button>
        <button className="tabbtn" aria-selected={tab==="lancamentos"} onClick={()=>setTab("lancamentos")}>Lançamentos</button>
        <button className="tabbtn" aria-selected={tab==="detalhes"} onClick={()=>setTab("detalhes")}>Detalhes</button>
        <button className="tabbtn" aria-selected={tab==="config"} onClick={()=>setTab("config")}>Configurações</button>
      </div>

      {tab==="resumo" && (
        <div className="space">
          <div className="card">
            <div className="title">Orçamento x Realizado por categoria (Despesas)</div>
            <div style={{overflowX:"auto"}}>
              <table>
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th className="right">Orçamento</th>
                    <th className="right">Realizado</th>
                    <th className="right">Diferença</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryRows.map((r)=>{
                    let status: "neutral"|"ok"|"warn"|"over" = "neutral";
                    if(r.budget>0){
                      if(r.realized<=r.budget) status = "ok";
                      else if(r.realized<=r.budget*1.1) status = "warn";
                      else status = "over";
                    }
                    return (
                      <tr key={r.category}>
                        <td>
                          {r.category}
                          <span className={`badge ${status}`}>{status==="neutral"?"Sem orçamento":status==="ok"?"Dentro":status==="warn"?"Até 110%":">110%"}</span>
                        </td>
                        <td className="right">{fmt(r.budget)}</td>
                        <td className="right">{fmt(r.realized)}</td>
                        <td className="right">{fmt(r.diff)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid2">
            <div className="card" style={{height:340}}>
              <div className="title">Participação por categoria (realizado)</div>
              <div style={{width:"100%",height:280}}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110}>
                      {pieData.map((_, i) => (<Cell key={i} />))}
                    </Pie>
                    <Tooltip formatter={(v:any)=>fmt(v as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card" style={{height:340}}>
              <div className="title">Orçado vs Realizado (top 8 por valor)</div>
              <div style={{width:"100%",height:280}}>
                <ResponsiveContainer>
                  <BarChart data={[...summaryRows].sort((a,b)=>b.realized-a.realized).slice(0,8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" hide />
                    <YAxis />
                    <Tooltip formatter={(v:any)=>fmt(v as number)} />
                    <Legend />
                    <Bar dataKey="budget" name="Orçado" />
                    <Bar dataKey="realized" name="Realizado" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="lancamentos" && (
        <div className="space">
          <AddTransactionForm
            month={month}
            categories={categories}
            onAdd={(t)=>addTransaction(t)}
          />
          <div className="card">
            <div className="title">Lançamentos do mês</div>
            <div style={{overflowX:"auto"}}>
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Tipo</th>
                    <th>Categoria</th>
                    <th>Descrição</th>
                    <th className="right">Valor</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {[...monthTx].sort((a,b)=> a.date.localeCompare(b.date)).map(t => (
                    <tr key={t.id}>
                      <td>{t.date}</td>
                      <td>{t.type}</td>
                      <td>{t.category}</td>
                      <td>{t.description}</td>
                      <td className="right">{t.type==="Receita"? "+" : "-"}{fmt(t.amount)}</td>
                      <td className="right">
                        <button onClick={()=>removeTransaction(t.id)}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab==="detalhes" && (
        <div className="space">
          <div className="card">
            <div className="title">Detalhes analíticos</div>
            <div className="controls" style={{flexWrap:"wrap"}}>
              <select value={detailType} onChange={(e)=> setDetailType((e.target as HTMLSelectElement).value as any)}>
                <option value="Despesa">Despesa</option>
                <option value="Receita">Receita</option>
              </select>
              <select value={detailCat} onChange={(e)=> setDetailCat((e.target as HTMLSelectElement).value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="card">
            <div className="title">{detailType} — {detailCat} ({month})</div>
            <div style={{overflowX:"auto"}}>
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th className="right">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {detailTx.map(t => (
                    <tr key={t.id}>
                      <td>{t.date}</td>
                      <td>{t.description}</td>
                      <td className="right">{detailType==="Receita"? "+":"-"}{fmt(t.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2}><b>Total</b></td>
                    <td className="right"><b>{detailType==="Receita"? "+":"-"}{fmt(detailTotal)}</b></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab==="config" && (
        <div className="space">
          <div className="card">
            <div className="title">Orçamentos por categoria ({month})</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 120px",gap:"8px 12px"}}>
              {categories.map(cat => (
                <React.Fragment key={cat}>
                  <div>{cat}</div>
                  <input type="number" step="0.01" value={(budgets[month]?.[cat]||0)}
                    onChange={(e)=> setBudgetFor(cat, Number((e.target as HTMLInputElement).value))} />
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="title">Categorias</div>
            <CategoryManager categories={categories} setCategories={setCategories} />
          </div>
        </div>
      )}

      <div className="footer">Dados salvos localmente no seu navegador. Exporte para backup quando quiser.</div>
    </div>
  );
}

function AddTransactionForm({ month, categories, onAdd }:{ month:string, categories:string[], onAdd:(t:any)=>void }){
  const [date, setDate] = useState(() => month+"-01");
  const [type, setType] = useState<"Despesa"|"Receita">("Despesa");
  const [category, setCategory] = useState(categories[0]||"");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);

  useEffect(()=>{
    if(!categories.includes(category) && categories.length>0){
      setCategory(categories[0]);
    }
  },[categories]);

  const submit = () => {
    if(!amount || !category){ return; }
    onAdd({ date, month, type, category, description, amount: Math.abs(Number(amount)) });
    setDescription(""); setAmount(0);
  };

  return (
    <div className="card">
      <div className="title">Novo lançamento</div>
      <div className="controls" style={{flexWrap:"wrap"}}>
        <input type="date" value={date} onChange={(e)=> setDate((e.target as HTMLInputElement).value)} />
        <select value={type} onChange={(e)=> setType((e.target as HTMLSelectElement).value as any)}>
          <option value="Despesa">Despesa</option>
          <option value="Receita">Receita</option>
        </select>
        <select value={category} onChange={(e)=> setCategory((e.target as HTMLSelectElement).value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="Descrição" value={description} onChange={(e)=>setDescription((e.target as HTMLInputElement).value)} />
        <input type="number" step="0.01" value={amount} onChange={(e)=>setAmount(Number((e.target as HTMLInputElement).value))} />
        <button className="primary" onClick={submit}>Adicionar</button>
      </div>
    </div>
  );
}

function CategoryManager({ categories, setCategories }:{ categories:string[], setCategories:(v:string[])=>void }){
  const [newCat, setNewCat] = useState("");
  const add = () => {
    const name = newCat.trim();
    if(!name) return;
    if(categories.includes(name)) return alert("Categoria já existe");
    setCategories([...categories, name]);
    setNewCat("");
  };
  const remove = (name:string) => setCategories(categories.filter(c=>c!==name));

  return (
    <div>
      <div className="controls">
        <input placeholder="Nova categoria" value={newCat} onChange={(e)=>setNewCat((e.target as HTMLInputElement).value)} />
        <button onClick={add}>Adicionar</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"8px"}}>
        {categories.map(c => (
          <React.Fragment key={c}>
            <div>{c}</div>
            <button onClick={()=>remove(c)}>Remover</button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
