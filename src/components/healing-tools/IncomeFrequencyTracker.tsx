import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useHealingToolEntries } from "@/hooks/useHealingToolEntries";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, DollarSign, TrendingUp, Sparkles } from "lucide-react";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export default function IncomeFrequencyTracker() {
  const { entries, saveEntry, deleteEntry } = useHealingToolEntries("income-frequency-tracker");
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [unexpected, setUnexpected] = useState(false);
  const [celebration, setCelebration] = useState("");
  const [monthlyGoal, setMonthlyGoal] = useState("");

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    let total = 0;
    let unexpectedTotal = 0;
    let thisMonth = 0;

    entries.forEach((e: any) => {
      const d = e.entry_data;
      const amt = parseFloat(d.amount) || 0;
      total += amt;
      if (d.unexpected) unexpectedTotal += amt;
      const entryDate = new Date(d.date);
      if (isWithinInterval(entryDate, { start: monthStart, end: monthEnd })) {
        thisMonth += amt;
      }
    });

    return { total, unexpectedTotal, thisMonth };
  }, [entries]);

  const goalEntry = entries.find((e: any) => e.entry_data.type === "goal");
  const incomeEntries = entries.filter((e: any) => e.entry_data.type !== "goal");
  const goalData = goalEntry?.entry_data as any;
  const currentGoal = goalData?.goalAmount ? parseFloat(goalData.goalAmount) : 0;
  const goalProgress = currentGoal > 0 ? Math.min((stats.thisMonth / currentGoal) * 100, 100) : 0;

  const handleSave = () => {
    if (!amount || !source) return;
    saveEntry.mutate(
      { type: "income", amount, source, date, unexpected, celebration },
      {
        onSuccess: () => {
          setAmount(""); setSource(""); setDate(format(new Date(), "yyyy-MM-dd"));
          setUnexpected(false); setCelebration(""); setShowForm(false);
        },
      }
    );
  };

  const handleSaveGoal = () => {
    if (!monthlyGoal) return;
    saveEntry.mutate({ type: "goal", goalAmount: monthlyGoal });
    setMonthlyGoal("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card text-center p-4">
          <DollarSign className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-2xl font-serif text-accent">${stats.total.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Logged</p>
        </Card>
        <Card className="glass-card text-center p-4">
          <TrendingUp className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-2xl font-serif text-accent">${stats.thisMonth.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">This Month</p>
        </Card>
        <Card className="glass-card text-center p-4">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-2xl font-serif text-accent">${stats.unexpectedTotal.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Unexpected Income</p>
        </Card>
      </div>

      {currentGoal > 0 && (
        <Card className="glass-card p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Monthly Goal</span>
            <span className="text-accent font-semibold">${stats.thisMonth.toLocaleString()} / ${currentGoal.toLocaleString()}</span>
          </div>
          <Progress value={goalProgress} className="h-2" />
        </Card>
      )}

      <div className="flex gap-3 flex-wrap">
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="w-4 h-4 mr-2" /> Log Income
          </Button>
        )}
        {!currentGoal && (
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Monthly goal..."
              value={monthlyGoal}
              onChange={(e) => setMonthlyGoal(e.target.value)}
              className="w-40 bg-input border-border"
            />
            <Button variant="outline" size="sm" onClick={handleSaveGoal} disabled={!monthlyGoal}>
              Set Goal
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="glass-card">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground font-semibold">Amount</Label>
                    <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-input border-border" />
                  </div>
                  <div>
                    <Label className="text-foreground font-semibold">Date</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-input border-border" />
                  </div>
                </div>
                <div>
                  <Label className="text-foreground font-semibold">Source</Label>
                  <Input placeholder="Where did this come from?" value={source} onChange={(e) => setSource(e.target.value)} className="bg-input border-border" />
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={unexpected} onCheckedChange={setUnexpected} />
                  <Label className="text-foreground">This was unexpected income ✨</Label>
                </div>
                <div className="glass-card p-4 text-sm text-accent italic text-center">
                  This arrived because I am...
                </div>
                <div>
                  <Label className="text-foreground font-semibold">Celebration</Label>
                  <Textarea placeholder="This arrived because I am..." value={celebration} onChange={(e) => setCelebration(e.target.value)} className="bg-input border-border" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSave} disabled={saveEntry.isPending} className="bg-accent text-accent-foreground">
                    {saveEntry.isPending ? "Saving..." : "Log It"}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {incomeEntries.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-serif text-xl text-foreground">Income Log</h3>
          {incomeEntries.map((entry: any) => {
            const d = entry.entry_data;
            return (
              <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className={`glass-card ${d.unexpected ? "border-accent/30" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-accent font-serif text-lg font-bold">${parseFloat(d.amount).toLocaleString()}</span>
                          {d.unexpected && <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">✨ Unexpected</span>}
                        </div>
                        <p className="text-sm text-foreground/80">{d.source}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(d.date), "MMM d, yyyy")}</p>
                        {d.celebration && <p className="text-sm text-muted-foreground italic mt-1">"{d.celebration}"</p>}
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive h-6 w-6 p-0" onClick={() => deleteEntry.mutate(entry.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
