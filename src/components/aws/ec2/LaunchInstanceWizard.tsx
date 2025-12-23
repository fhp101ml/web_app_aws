'use client';

import { useState, useTransition } from 'react';
import { X, Check, Server, HardDrive, Tag, ArrowRight, ArrowLeft } from 'lucide-react';
import { createInstanceAction } from '@/app/actions/aws';
import { useRouter } from 'next/navigation';

interface LaunchInstanceWizardProps {
    isOpen: boolean;
    onClose: () => void;
    providerType: 'aws' | 'localstack';
}

const AMIS = [
    { id: 'ami-0c7217cdde317cfec', name: 'Ubuntu Server 22.04 LTS', description: 'Free tier eligible' },
    { id: 'ami-053b0d53c279acc90', name: 'Amazon Linux 2023', description: 'Optimized for AWS' },
    { id: 'ami-0230bd60aa48260c6', name: 'Red Hat Enterprise Linux 9', description: 'Enterprise grade' },
];

const INSTANCE_TYPES = [
    { id: 't2.micro', vcpu: 1, ram: '1 GiB', price: '$0.0116/hr' },
    { id: 't3.small', vcpu: 2, ram: '2 GiB', price: '$0.0208/hr' },
    { id: 'm5.large', vcpu: 2, ram: '8 GiB', price: '$0.0960/hr' },
];

export function LaunchInstanceWizard({ isOpen, onClose, providerType }: LaunchInstanceWizardProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedAmi, setSelectedAmi] = useState(AMIS[0].id);
    const [selectedType, setSelectedType] = useState(INSTANCE_TYPES[0].id);
    const [instanceName, setInstanceName] = useState('');
    const [isPending, startTransition] = useTransition();

    if (!isOpen) return null;

    const handleLaunch = () => {
        startTransition(async () => {
            // Using the current action which takes no args, assuming defaults.
            // In a real app we would pass selectedAmi, selectedType, instanceName.
            await createInstanceAction(providerType);
            router.refresh();
            onClose();
            setStep(1); // Reset
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0f172a] border border-[rgba(255,255,255,0.1)] rounded-xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-[rgba(255,255,255,0.1)] flex justify-between items-center bg-[#1e293b]/50 rounded-t-xl">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Server className="text-blue-500" /> Launch New Instance
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 pt-6">
                    <div className="flex items-center justify-between relative mb-8">
                        <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-700 -z-10" />

                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`flex flex-col items-center gap-2 bg-[#0f172a] px-2 ${step >= s ? 'text-blue-400' : 'text-slate-500'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${step >= s ? 'border-blue-500 bg-blue-500/10 text-blue-500' : 'border-slate-600 bg-slate-800 text-slate-400'
                                    }`}>
                                    {s}
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-wider">
                                    {s === 1 ? 'Choose AMI' : s === 2 ? 'Instance Type' : 'Configure'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 min-h-[400px]">
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Select Machine Image (AMI)</h3>
                            {AMIS.map((ami) => (
                                <div
                                    key={ami.id}
                                    onClick={() => setSelectedAmi(ami.id)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center gap-4 ${selectedAmi === ami.id
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : 'border-[rgba(255,255,255,0.05)] bg-[#1e293b]/50 hover:border-slate-500'
                                        }`}
                                >
                                    <div className="p-2 bg-slate-700 rounded text-slate-300">
                                        <HardDrive size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white font-medium">{ami.name}</div>
                                        <div className="text-sm text-slate-400">{ami.description}</div>
                                        <div className="text-xs text-slate-500 font-mono mt-1">{ami.id}</div>
                                    </div>
                                    {selectedAmi === ami.id && <Check className="text-blue-500" />}
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Choose Instance Type</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {INSTANCE_TYPES.map((type) => (
                                    <div
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${selectedType === type.id
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-[rgba(255,255,255,0.05)] bg-[#1e293b]/50 hover:border-slate-500'
                                            }`}
                                    >
                                        <div>
                                            <div className="text-white font-bold text-lg">{type.id}</div>
                                            <div className="text-sm text-slate-400">{type.vcpu} vCPU • {type.ram} RAM</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-emerald-400 font-mono">{type.price}</div>
                                            {selectedType === type.id && <div className="text-xs text-blue-500 mt-1 flex justify-end items-center gap-1"><Check size={12} /> Selected</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Configure & Review</h3>

                            <div className="space-y-2">
                                <label className="text-sm text-slate-400 font-medium">Instance Name (Tag: Name)</label>
                                <div className="flex items-center gap-2 bg-[#1e293b] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2">
                                    <Tag className="text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        value={instanceName}
                                        onChange={(e) => setInstanceName(e.target.value)}
                                        placeholder="e.g., Web-Server-01"
                                        className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-600"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="bg-[#1e293b]/50 rounded-lg p-4 border border-[rgba(255,255,255,0.05)] mt-6">
                                <h4 className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-3">Summary</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="text-slate-400">AMI ID</div>
                                    <div className="text-white font-mono text-right">{selectedAmi}</div>

                                    <div className="text-slate-400">Instance Type</div>
                                    <div className="text-white font-mono text-right">{selectedType}</div>

                                    <div className="text-slate-400">Region</div>
                                    <div className="text-white text-right">us-east-1</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer / Controls */}
                <div className="p-6 border-t border-[rgba(255,255,255,0.1)] flex justify-between bg-[#1e293b]/50 rounded-b-xl">
                    <button
                        onClick={() => setStep(s => Math.max(1, s - 1))}
                        disabled={step === 1}
                        className="px-4 py-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 flex items-center gap-2"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(s => s + 1)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            Next Step <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleLaunch}
                            disabled={isPending}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {isPending ? <span className="animate-spin">⟳</span> : <Server size={18} />}
                            Launch Instance
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
