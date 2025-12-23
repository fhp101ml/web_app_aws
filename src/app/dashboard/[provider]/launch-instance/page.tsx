'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Server, HardDrive, Tag, ArrowRight, ArrowLeft, Cpu, Activity } from 'lucide-react';
import { createInstanceAction } from '@/app/actions/aws';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import styles from '@/components/aws/aws.module.css';

const AMIS = [
    { id: 'ami-0c7217cdde317cfec', name: 'Ubuntu Server 22.04 LTS', description: 'Free tier eligible', icon: <Server className="text-orange-500" /> },
    { id: 'ami-053b0d53c279acc90', name: 'Amazon Linux 2023', description: 'Optimized for AWS', icon: <Server className="text-blue-500" /> },
    { id: 'ami-0230bd60aa48260c6', name: 'Red Hat Enterprise Linux 9', description: 'Enterprise grade', icon: <Server className="text-red-500" /> },
    // { id: 'ami-041feb57c611358bd', name: 'Windows Server 2022', description: 'Base version', icon: <Server className="text-sky-500" /> },
];

const INSTANCE_TYPES = [
    { id: 't2.micro', vcpu: 1, ram: '1 GiB', price: '$0.0116/hr', popular: true },
    { id: 't3.small', vcpu: 2, ram: '2 GiB', price: '$0.0208/hr', popular: false },
    { id: 't3.medium', vcpu: 2, ram: '4 GiB', price: '$0.0416/hr', popular: false },
];

export default function LaunchInstancePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedAmi, setSelectedAmi] = useState(AMIS[0].id);
    const [selectedType, setSelectedType] = useState(INSTANCE_TYPES[0].id);
    const [instanceName, setInstanceName] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleLaunch = () => {
        startTransition(async () => {
            // Updated to pass dynamic parameters
            // providerType, amiId, instanceType, name
            const result = await createInstanceAction('aws', selectedAmi, selectedType, instanceName);
            if (result.success) {
                if (window.opener) {
                    window.opener.location.reload();
                    window.close();
                } else {
                    router.push('/dashboard/aws?tab=compute');
                }
            } else {
                alert('Failed to launch instance: ' + result.error);
            }
        });
    };

    return (
        <div className="min-h-screen bg-[hsl(var(--bg-primary))] text-[hsl(var(--text-primary))] p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[hsl(var(--glass-border))] pb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Launch Instance
                        </h1>
                        <p className="text-[hsl(var(--text-muted))] mt-2">
                            Configure and launch a new EC2 instance in us-east-1.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/20">
                            AWS REGION: US-EAST-1
                        </span>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`
                                relative p-4 rounded-lg border transition-all duration-300
                                ${step === s
                                    ? 'bg-[hsl(var(--bg-card))] border-[hsl(var(--aws-orange))] shadow-lg'
                                    : step > s
                                        ? 'bg-[hsl(var(--bg-card))] border-green-500/50 opacity-70'
                                        : 'bg-transparent border-[hsl(var(--glass-border))] opacity-50'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                    ${step === s ? 'bg-[hsl(var(--aws-orange))] text-black' : step > s ? 'bg-green-500 text-black' : 'bg-slate-700 text-slate-400'}
                                `}>
                                    {step > s ? <Check size={16} strokeWidth={3} /> : s}
                                </div>
                                <div>
                                    <h3 className={`text-sm font-bold uppercase tracking-wider ${step === s ? 'text-[hsl(var(--aws-orange))]' : 'text-[hsl(var(--text-muted))]'}`}>
                                        {s === 1 ? 'Choose AMI' : s === 2 ? 'Instance Type' : 'Review & Launch'}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <br></br>
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="min-h-[400px]">
                            {step === 1 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold mb-6">Select Machine Image</h2>
                                    <br></br>
                                    {/* Grid layout for AMIs */}
                                    {/* <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]"> */}
                                    <div
                                        className="w-full max-w-none"
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                                            gap: "0.75rem",
                                        }}
                                    >
                                        {AMIS.map((ami) => (
                                            <div
                                                key={ami.id}
                                                onClick={() => setSelectedAmi(ami.id)}
                                                className={`
        cursor-pointer p-4 rounded-xl border-2 flex flex-col gap-3 transition-all relative overflow-hidden group
        min-w-0
        ${selectedAmi === ami.id
                                                        ? 'bg-orange-500/10 border-[hsl(var(--aws-orange))] shadow-[0_0_25px_rgba(255,153,0,0.15)] ring-1 ring-[hsl(var(--aws-orange))]/30'
                                                        : 'bg-white/5 border-[hsl(var(--glass-border))] hover:border-slate-500 hover:bg-white/10'
                                                    }
      `}
                                            >
                                                {selectedAmi === ami.id && (
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--aws-orange))]/10 to-transparent pointer-events-none" />
                                                )}

                                                <div className="flex items-start justify-between relative z-10 min-w-0">
                                                    <div className={`p-2 rounded-lg transition-all duration-300 ${selectedAmi === ami.id ? 'bg-[hsl(var(--aws-orange))]/20 scale-110' : 'bg-slate-800'}`}>
                                                        {ami.icon}
                                                    </div>
                                                    {selectedAmi === ami.id && (
                                                        <div className="w-5 h-5 bg-[hsl(var(--aws-orange))] rounded-full flex items-center justify-center animate-in zoom-in duration-300 shadow-[0_0_10px_rgba(255,153,0,0.5)]">
                                                            <Check size={12} className="text-black stroke-[4]" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="relative z-10 min-w-0">
                                                    <h3 className={`font-bold text-sm leading-tight transition-colors ${selectedAmi === ami.id ? 'text-[hsl(var(--aws-orange))]' : 'text-white'}`}>
                                                        {ami.name}
                                                    </h3>
                                                    <p className="text-[10px] text-[hsl(var(--text-muted))] mt-1 line-clamp-1">
                                                        {ami.description}
                                                    </p>
                                                </div>

                                                <div className="mt-auto pt-3 border-t border-white/5 relative z-10 min-w-0">
                                                    <code className="text-[9px] text-slate-500 font-mono bg-black/40 px-1.5 py-0.5 rounded truncate block min-w-0">
                                                        {ami.id}
                                                    </code>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold mb-6">Choose Instance Type</h2>
                                    <br></br>
                                    {/* Grid layout for Instance Types */}
                                    <div
                                        className="w-full max-w-none"
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                                            gap: "0.75rem",
                                        }}
                                    >
                                        {INSTANCE_TYPES.map((type) => (
                                            <div
                                                key={type.id}
                                                onClick={() => setSelectedType(type.id)}
                                                className={`
                                                    cursor-pointer p-5 rounded-xl border-2 flex flex-col justify-between transition-all relative overflow-hidden group min-h-[160px]
                                                    ${selectedType === type.id
                                                        ? 'bg-orange-500/10 border-[hsl(var(--aws-orange))] shadow-[0_0_25px_rgba(255,153,0,0.15)] ring-1 ring-[hsl(var(--aws-orange))]/30'
                                                        : 'bg-white/5 border-[hsl(var(--glass-border))] hover:border-slate-500 hover:bg-white/10'
                                                    }
                                                `}
                                            >
                                                {selectedType === type.id && (
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--aws-orange))]/10 to-transparent pointer-events-none" />
                                                )}

                                                <div className="flex justify-between items-start relative z-10">
                                                    <div className={`p-2 rounded transition-all ${selectedType === type.id ? 'bg-[hsl(var(--aws-orange))]/20 text-[hsl(var(--aws-orange))]' : 'bg-slate-800 text-slate-400'}`}>
                                                        <Cpu size={24} />
                                                    </div>
                                                    {selectedType === type.id && (
                                                        <div className="w-6 h-6 bg-[hsl(var(--aws-orange))] rounded-full flex items-center justify-center animate-in zoom-in duration-300 shadow-[0_0_10px_rgba(255,153,0,0.5)]">
                                                            <Check size={14} className="text-black stroke-[4]" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="relative z-10">
                                                    <h3 className={`font-bold text-2xl font-mono tracking-tight transition-colors ${selectedType === type.id ? 'text-[hsl(var(--aws-orange))]' : 'text-white'}`}>
                                                        {type.id}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1 text-sm text-[hsl(var(--text-muted))]">
                                                        <span>{type.vcpu} vCPU</span>
                                                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                                        <span>{type.ram} RAM</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-4 relative z-10">
                                                    <div className={`font-bold px-2 py-1 rounded text-sm transition-colors ${selectedType === type.id ? 'bg-[hsl(var(--aws-orange))]/20 text-[hsl(var(--aws-orange))]' : 'bg-emerald-400/10 text-emerald-400'}`}>
                                                        {type.price}
                                                    </div>
                                                    {type.popular && (
                                                        <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-900/30 px-2 py-1 rounded border border-blue-500/20">
                                                            Free Tier
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-xl font-bold mb-6">Configure & Review</h2>
                                        <div className="space-y-4">
                                            <label className="block text-sm font-medium text-[hsl(var(--text-secondary))]">Instance Name</label>
                                            <div className="relative">
                                                <Tag className="absolute left-3 top-3 text-[hsl(var(--text-muted))]" size={16} />
                                                <input
                                                    type="text"
                                                    value={instanceName}
                                                    onChange={(e) => setInstanceName(e.target.value)}
                                                    placeholder="e.g. Production-Web-Server"
                                                    className="w-full bg-[rgba(255,255,255,0.03)] border border-[hsl(var(--glass-border))] rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-[hsl(var(--aws-orange))] focus:outline-none transition-colors"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[hsl(var(--bg-secondary))] border border-[hsl(var(--glass-border))] rounded-lg overflow-hidden">
                                        <div className="p-4 border-b border-[hsl(var(--glass-border))] font-bold text-[hsl(var(--text-secondary))] text-sm uppercase tracking-wider">
                                            Instance Summary
                                        </div>
                                        <div className="p-4 space-y-4">
                                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                <span className="text-[hsl(var(--text-muted))]">AMI Image</span>
                                                <span className="font-mono">{AMIS.find(a => a.id === selectedAmi)?.name}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                <span className="text-[hsl(var(--text-muted))]">Instance Type</span>
                                                <span className="font-mono text-[hsl(var(--aws-orange))]">{selectedType}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-[hsl(var(--text-muted))]">Region</span>
                                                <span className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    us-east-1
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                    <br></br>

                    {/* Right Column: Actions */}
                    <div className="space-y-6">
                        <Card className="p-6 sticky top-8">
                            <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Launch Checklist</h3>

                            <br></br>
                            <br></br>

                            <ul className="space-y-3 mb-8">
                                <li className={`flex items-center gap-3 text-sm ${step > 1 ? 'text-green-400' : 'text-slate-500'}`}>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${step > 1 ? 'border-green-500 bg-green-500/20' : 'border-slate-600'}`}>
                                        {step > 1 && <Check size={12} />}
                                    </div>
                                    AMI Selected
                                </li>
                                <li className={`flex items-center gap-3 text-sm ${step > 2 ? 'text-green-400' : 'text-slate-500'}`}>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${step > 2 ? 'border-green-500 bg-green-500/20' : 'border-slate-600'}`}>
                                        {step > 2 && <Check size={12} />}
                                    </div>
                                    Type Selected
                                </li>
                                <li className={`flex items-center gap-3 text-sm ${step === 3 && instanceName ? 'text-green-400' : 'text-slate-500'}`}>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${step === 3 && instanceName ? 'border-green-500 bg-green-500/20' : 'border-slate-600'}`}>
                                        {step === 3 && instanceName && <Check size={12} />}
                                    </div>
                                    Configured
                                </li>
                            </ul>
                            <br></br>
                            <br></br>

                            <div className="flex flex-col gap-3">
                                {step < 3 ? (
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-full justify-center"
                                        onClick={() => setStep(s => s + 1)}
                                        rightIcon={<ArrowRight size={16} />}
                                    >
                                        Next Step
                                    </Button>
                                ) : (
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-full justify-center"
                                        onClick={handleLaunch}
                                        isLoading={isPending}
                                        leftIcon={<Activity size={16} />}
                                    >
                                        Launch Instance
                                    </Button>
                                )}

                                <Button
                                    variant="ghost"
                                    className="w-full justify-center text-[hsl(var(--text-muted))]"
                                    onClick={() => step === 1 ? router.back() : setStep(s => s - 1)}
                                    leftIcon={<ArrowLeft size={16} />}
                                >
                                    {step === 1 ? 'Cancel Launch' : 'Back to previous step'}
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
