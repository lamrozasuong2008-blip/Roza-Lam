/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Eye,
  Settings,
  Globe,
  Linkedin,
  Github,
  Send,
  Check,
  Languages,
  FileText,
  AlignLeft,
  X,
  PlusCircle,
  HelpCircle,
  User,
  ExternalLink as LinkIcon
} from 'lucide-react';
import { CVData, ThemeId, ThemeConfig, EducationItem, SkillItem, ProjectItem, LanguageItem, PortfolioLinkItem } from './types';
import { defaultCVData } from './defaultData';

const THEMES: ThemeConfig[] = [
  {
    id: 'clean_minimalism',
    name: 'Clean Minimalism (Default)',
    primaryColor: '#0f172a', // slate-900
    accentColor: '#2563eb', // blue-600
    fontSans: 'font-sans',
    fontSerif: 'font-sans',
    bgClass: 'bg-slate-900',
    accentText: 'text-blue-600',
    borderClass: 'border-slate-100'
  },
  {
    id: 'classic_navy',
    name: 'Classic Corporate',
    primaryColor: '#0f172a', // slate-900
    accentColor: '#1e3a8a', // blue-900
    fontSans: 'font-sans',
    fontSerif: 'font-sans',
    bgClass: 'bg-slate-900',
    accentText: 'text-blue-700',
    borderClass: 'border-blue-900'
  },
  {
    id: 'digital_emerald',
    name: 'Tech & Digital Economy',
    primaryColor: '#022c22', // emerald-950
    accentColor: '#059669', // emerald-600
    fontSans: 'font-display',
    fontSerif: 'font-display',
    bgClass: 'bg-emerald-950',
    accentText: 'text-emerald-600',
    borderClass: 'border-emerald-600'
  },
  {
    id: 'minimal_slate',
    name: 'Minimalist Slate',
    primaryColor: '#18181b', // zinc-900
    accentColor: '#52525b', // zinc-600
    fontSans: 'font-sans',
    fontSerif: 'font-mono',
    bgClass: 'bg-zinc-900',
    accentText: 'text-zinc-600',
    borderClass: 'border-zinc-300'
  },
  {
    id: 'editorial_burgundy',
    name: 'Editorial Burgundy',
    primaryColor: '#4c0519', // rose-950
    accentColor: '#9f1239', // rose-800
    fontSans: 'font-sans',
    fontSerif: 'font-serif',
    bgClass: 'bg-rose-950',
    accentText: 'text-rose-800',
    borderClass: 'border-rose-800'
  },
  {
    id: 'warm_amber',
    name: 'Warm Executive',
    primaryColor: '#451a03', // amber-950
    accentColor: '#b45309', // amber-700
    fontSans: 'font-sans',
    fontSerif: 'font-sans',
    bgClass: 'bg-amber-950',
    accentText: 'text-amber-700',
    borderClass: 'border-amber-700'
  }
];

export default function App() {
  const [cvData, setCvData] = useState<CVData>(() => {
    const saved = localStorage.getItem('lam_roza_cv_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.personalInfo) {
          if (parsed.personalInfo.showPhoto === undefined) {
            parsed.personalInfo.showPhoto = true;
          }
          if (parsed.personalInfo.photoUrl === undefined || 
              parsed.personalInfo.photoUrl === "" || 
              parsed.personalInfo.photoUrl.includes("roza_profile_pic_1784022921892.jpg") ||
              parsed.personalInfo.photoUrl.includes("roza_blue_passport_photo_1784083742739.jpg") ||
              parsed.personalInfo.photoUrl.startsWith("/src/assets/images/")) {
            parsed.personalInfo.photoUrl = defaultCVData.personalInfo.photoUrl;
          }
        }
        return parsed;
      } catch (e) {
        console.error("Error reading CV from localStorage, using default", e);
      }
    }
    return defaultCVData;
  });

  const [activeTheme, setActiveTheme] = useState<ThemeId>(() => {
    const savedTheme = localStorage.getItem('lam_roza_cv_theme');
    return (savedTheme as ThemeId) || 'clean_minimalism';
  });

  const [showEditor, setShowEditor] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'info' | 'education' | 'skills' | 'projects' | 'languages' | 'links' | 'presets'>('info');
  const [hasSaved, setHasSaved] = useState<boolean>(false);
  
  // Custom states for adding items easily
  const [newEdu, setNewEdu] = useState<Omit<EducationItem, 'id'>>({ degree: '', institution: '', duration: '', description: '' });
  const [newSkill, setNewSkill] = useState<Omit<SkillItem, 'id'>>({ name: '', description: '' });
  const [newProject, setNewProject] = useState<Omit<ProjectItem, 'id'>>({ title: '', subtitle: '', bullets: [''] });
  const [newBullet, setNewBullet] = useState<string>('');
  const [newLanguage, setNewLanguage] = useState<Omit<LanguageItem, 'id'>>({ name: '', proficiency: '' });
  const [newLink, setNewLink] = useState<Omit<PortfolioLinkItem, 'id'>>({ platform: 'linkedin', label: '', url: '' });

  const activeThemeConfig = THEMES.find(t => t.id === activeTheme) || THEMES[0];

  useEffect(() => {
    localStorage.setItem('lam_roza_cv_data', JSON.stringify(cvData));
    localStorage.setItem('lam_roza_cv_theme', activeTheme);
  }, [cvData, activeTheme]);

  const handlePersonalInfoChange = (field: keyof typeof cvData.personalInfo, value: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleSaveNotification = () => {
    setHasSaved(true);
    setTimeout(() => setHasSaved(false), 2000);
  };

  const resetToDefault = () => {
    if (window.confirm("Are you sure you want to reset all information to default? Any custom changes will be lost.")) {
      setCvData(defaultCVData);
      setActiveTheme('clean_minimalism');
      handleSaveNotification();
    }
  };

  const printCV = () => {
    window.print();
  };

  // Education list handlers
  const addEducation = () => {
    if (!newEdu.degree || !newEdu.institution) {
      alert("Please enter both the degree and institution.");
      return;
    }
    const item: EducationItem = {
      id: `edu-${Date.now()}`,
      ...newEdu
    };
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, item]
    }));
    setNewEdu({ degree: '', institution: '', duration: '', description: '' });
    handleSaveNotification();
  };

  const removeEducation = (id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id)
    }));
    handleSaveNotification();
  };

  // Skills handlers
  const addSkill = () => {
    if (!newSkill.name || !newSkill.description) {
      alert("Please provide both skill name and description.");
      return;
    }
    const item: SkillItem = {
      id: `skill-${Date.now()}`,
      ...newSkill
    };
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, item]
    }));
    setNewSkill({ name: '', description: '' });
    handleSaveNotification();
  };

  const removeSkill = (id: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(item => item.id !== id)
    }));
    handleSaveNotification();
  };

  // Projects handlers
  const addProject = () => {
    if (!newProject.title) {
      alert("Please provide a project title.");
      return;
    }
    const item: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: newProject.title,
      subtitle: newProject.subtitle,
      bullets: newProject.bullets.filter(b => b.trim() !== '')
    };
    setCvData(prev => ({
      ...prev,
      projects: [...prev.projects, item]
    }));
    setNewProject({ title: '', subtitle: '', bullets: [''] });
    handleSaveNotification();
  };

  const removeProject = (id: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter(item => item.id !== id)
    }));
    handleSaveNotification();
  };

  const addBulletToNewProject = () => {
    if (newBullet.trim() === '') return;
    setNewProject(prev => ({
      ...prev,
      bullets: [...prev.bullets, newBullet]
    }));
    setNewBullet('');
  };

  const removeBulletFromNewProject = (index: number) => {
    setNewProject(prev => ({
      ...prev,
      bullets: prev.bullets.filter((_, i) => i !== index)
    }));
  };

  // Languages handlers
  const addLanguage = () => {
    if (!newLanguage.name || !newLanguage.proficiency) {
      alert("Please enter both language name and proficiency.");
      return;
    }
    const item: LanguageItem = {
      id: `lang-${Date.now()}`,
      ...newLanguage
    };
    setCvData(prev => ({
      ...prev,
      languages: [...prev.languages, item]
    }));
    setNewLanguage({ name: '', proficiency: '' });
    handleSaveNotification();
  };

  const removeLanguage = (id: string) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter(item => item.id !== id)
    }));
    handleSaveNotification();
  };

  // Links handlers
  const addLink = () => {
    if (!newLink.label || !newLink.url) {
      alert("Please enter both a label and a URL.");
      return;
    }
    const item: PortfolioLinkItem = {
      id: `link-${Date.now()}`,
      ...newLink
    };
    setCvData(prev => ({
      ...prev,
      portfolioLinks: [...prev.portfolioLinks, item]
    }));
    setNewLink({ platform: 'linkedin', label: '', url: '' });
    handleSaveNotification();
  };

  const removeLink = (id: string) => {
    setCvData(prev => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.filter(item => item.id !== id)
    }));
    handleSaveNotification();
  };

  const getPlatformIcon = (platform: PortfolioLinkItem['platform']) => {
    switch (platform) {
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'github': return <Github className="w-4 h-4" />;
      case 'telegram': return <Send className="w-4 h-4" />;
      case 'website': return <Globe className="w-4 h-4" />;
      default: return <LinkIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans transition-all duration-300">
      
      {/* Top Banner / Navigation - Hidden on Print */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              LR
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Lam Roza <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">CV Portfolio</span>
              </h1>
              <p className="text-xs text-slate-500">Professional Interactive Portfolio & Builder</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 transition text-sm font-medium cursor-pointer"
              id="btn-toggle-editor"
            >
              {showEditor ? (
                <>
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span>View Full CV</span>
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Customize & Edit</span>
                </>
              )}
            </button>

            <button
              onClick={printCV}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition text-sm font-semibold shadow-xs cursor-pointer"
              id="btn-print-cv"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={resetToDefault}
              className="flex items-center justify-center p-2 rounded-lg border border-slate-300 text-slate-500 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:bg-red-100 transition cursor-pointer"
              title="Reset all fields to defaults"
              id="btn-reset-cv"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 md:gap-8 items-start relative">
        
        {/* Save confirmation indicator toast - Hidden on print */}
        <AnimatePresence>
          {hasSaved && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="no-print fixed top-18 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-slate-800"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Progress Auto-saved Locally</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Left Customizer Panel - Hidden on Print */}
        <AnimatePresence mode="popLayout">
          {showEditor && (
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="no-print w-full lg:w-96 shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-22 max-h-[calc(100vh-7.5rem)] flex flex-col"
              id="editor-sidebar"
            >
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-blue-600" /> Customize CV Content
                </span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Auto-save On</span>
              </div>

              {/* Tabs navigation */}
              <div className="flex overflow-x-auto border-b border-slate-150 scrollbar-none select-none bg-white py-1">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer transition ${
                    activeTab === 'info' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  General Info
                </button>
                <button
                  onClick={() => setActiveTab('presets')}
                  className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer transition ${
                    activeTab === 'presets' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Themes
                </button>
                <button
                  onClick={() => setActiveTab('education')}
                  className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer transition ${
                    activeTab === 'education' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Education
                </button>
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer transition ${
                    activeTab === 'skills' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Skills
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer transition ${
                    activeTab === 'projects' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab('languages')}
                  className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer transition ${
                    activeTab === 'languages' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Languages
                </button>
                <button
                  onClick={() => setActiveTab('links')}
                  className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap cursor-pointer transition ${
                    activeTab === 'links' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Links & Media
                </button>
              </div>

              {/* Tab panels container */}
              <div className="p-5 overflow-y-auto flex-1 space-y-4">
                
                {/* 1. General Info Tab */}
                {activeTab === 'info' && (
                  <div className="space-y-4">
                    {/* Profile Photo Section */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-600" /> Profile Photo
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={cvData.personalInfo.showPhoto !== false} 
                            onChange={(e) => {
                              setCvData(prev => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  showPhoto: e.target.checked
                                }
                              }));
                              handleSaveNotification();
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      {(cvData.personalInfo.showPhoto !== false) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            {cvData.personalInfo.photoUrl ? (
                              <img 
                                src={cvData.personalInfo.photoUrl} 
                                alt="Avatar preview" 
                                className="w-12 h-12 rounded-full object-cover border border-slate-300"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
                                No Photo
                              </div>
                            )}
                            <div className="flex-1 space-y-1">
                              <p className="text-[10px] text-slate-500">Upload a portrait or resume photo.</p>
                              <div className="flex gap-1.5">
                                <label className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-50 rounded text-[10px] font-medium text-slate-700 cursor-pointer transition">
                                  <span>Choose File</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          setCvData(prev => ({
                                            ...prev,
                                            personalInfo: {
                                              ...prev.personalInfo,
                                              photoUrl: reader.result as string
                                            }
                                          }));
                                          handleSaveNotification();
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>
                                {cvData.personalInfo.photoUrl !== defaultCVData.personalInfo.photoUrl && (
                                  <button
                                    onClick={() => {
                                      setCvData(prev => ({
                                        ...prev,
                                        personalInfo: {
                                          ...prev.personalInfo,
                                          photoUrl: defaultCVData.personalInfo.photoUrl
                                        }
                                      }));
                                      handleSaveNotification();
                                    }}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-[10px] font-medium text-slate-600 cursor-pointer transition"
                                  >
                                    Reset to Default
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                      <input
                        type="text"
                        value={cvData.personalInfo.name}
                        onChange={(e) => { handlePersonalInfoChange('name', e.target.value); handleSaveNotification(); }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Professional Title</label>
                      <input
                        type="text"
                        value={cvData.personalInfo.title}
                        onChange={(e) => { handlePersonalInfoChange('title', e.target.value); handleSaveNotification(); }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                        placeholder="Digital Economy Student"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Primary Phone</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.phone1}
                          onChange={(e) => { handlePersonalInfoChange('phone1', e.target.value); handleSaveNotification(); }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                          placeholder="+855 88 494 1096"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Secondary Phone</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.phone2}
                          onChange={(e) => { handlePersonalInfoChange('phone2', e.target.value); handleSaveNotification(); }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                          placeholder="096 262 1004"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Primary Email</label>
                        <input
                          type="email"
                          value={cvData.personalInfo.email1}
                          onChange={(e) => { handlePersonalInfoChange('email1', e.target.value); handleSaveNotification(); }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                          placeholder="rozalam64@gmail.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Secondary Email</label>
                        <input
                          type="email"
                          value={cvData.personalInfo.email2}
                          onChange={(e) => { handlePersonalInfoChange('email2', e.target.value); handleSaveNotification(); }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                          placeholder="lamroza2008suong@gmail.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Physical Address</label>
                      <input
                        type="text"
                        value={cvData.personalInfo.address}
                        onChange={(e) => { handlePersonalInfoChange('address', e.target.value); handleSaveNotification(); }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                        placeholder="Street 2002, Teuk Thla, Sen Sok, Phnom Penh, Cambodia"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Professional Summary</label>
                      <textarea
                        value={cvData.personalInfo.summary}
                        onChange={(e) => { handlePersonalInfoChange('summary', e.target.value); handleSaveNotification(); }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 h-28 resize-y"
                        placeholder="Write a brief intro highlighting your skills and career objectives..."
                      />
                    </div>
                  </div>
                )}

                {/* 2. Style / Themes Presets Tab */}
                {activeTab === 'presets' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 mb-2">Select a premium, polished theme to instantly alter the aesthetic of your resume.</p>
                    <div className="grid grid-cols-1 gap-2.5">
                      {THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => { setActiveTheme(theme.id); handleSaveNotification(); }}
                          className={`flex items-center gap-3 w-full p-3 rounded-lg border text-left transition cursor-pointer ${
                            activeTheme === theme.id 
                              ? 'border-blue-500 bg-blue-50/50 shadow-xs' 
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full ${theme.bgClass} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                            Aa
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-slate-800 truncate">{theme.name}</h4>
                            <p className="text-[11px] text-slate-500 capitalize">{theme.id.replace('_', ' ')} layout</p>
                          </div>
                          {activeTheme === theme.id && (
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Education Tab */}
                {activeTab === 'education' && (
                  <div className="space-y-4">
                    {/* List of current items */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Education History</h4>
                      {cvData.education.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No education entries added yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {cvData.education.map((item) => (
                            <div key={item.id} className="flex items-start justify-between p-2 rounded-lg border border-slate-200 bg-slate-50 gap-2">
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold text-slate-800 truncate">{item.degree}</h5>
                                <p className="text-[10px] text-slate-500 truncate">{item.institution}</p>
                              </div>
                              <button
                                onClick={() => removeEducation(item.id)}
                                className="p-1 text-slate-400 hover:text-red-500 rounded-md transition hover:bg-red-50 cursor-pointer"
                                title="Delete entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-200 pt-3 space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <PlusCircle className="w-3.5 h-3.5 text-emerald-500" /> Add New Education Entry
                      </h4>
                      <div>
                        <input
                          type="text"
                          placeholder="Degree Name (e.g. High School Diploma)"
                          value={newEdu.degree}
                          onChange={(e) => setNewEdu(prev => ({ ...prev, degree: e.target.value }))}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Institution Name (e.g. National University)"
                          value={newEdu.institution}
                          onChange={(e) => setNewEdu(prev => ({ ...prev, institution: e.target.value }))}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Duration / Years (e.g. 2025 – Present)"
                          value={newEdu.duration}
                          onChange={(e) => setNewEdu(prev => ({ ...prev, duration: e.target.value }))}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder="Brief Description or Key Achievements..."
                          value={newEdu.description}
                          onChange={(e) => setNewEdu(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-500 h-16 resize-y"
                        />
                      </div>
                      <button
                        onClick={addEducation}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-md text-xs font-semibold shadow-xs cursor-pointer transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Education</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Skills Tab */}
                {activeTab === 'skills' && (
                  <div className="space-y-4">
                    {/* List of current items */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Skills</h4>
                      {cvData.skills.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No skills added yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {cvData.skills.map((item) => (
                            <div key={item.id} className="flex items-start justify-between p-2 rounded-lg border border-slate-200 bg-slate-50 gap-2">
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold text-slate-800 truncate">{item.name}</h5>
                                <p className="text-[10px] text-slate-500 line-clamp-1">{item.description}</p>
                              </div>
                              <button
                                onClick={() => removeSkill(item.id)}
                                className="p-1 text-slate-400 hover:text-red-500 rounded-md transition hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-200 pt-3 space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <PlusCircle className="w-3.5 h-3.5 text-emerald-500" /> Add New Skill
                      </h4>
                      <div>
                        <input
                          type="text"
                          placeholder="Skill Name (e.g. Teamwork)"
                          value={newSkill.name}
                          onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder="Brief Description (e.g. Collaborating effectively...)"
                          value={newSkill.description}
                          onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-500 h-16 resize-y"
                        />
                      </div>
                      <button
                        onClick={addSkill}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-md text-xs font-semibold shadow-xs cursor-pointer transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Skill</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. Projects Tab */}
                {activeTab === 'projects' && (
                  <div className="space-y-4">
                    {/* List of current items */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Projects / Highlights</h4>
                      {cvData.projects.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No project entries added yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {cvData.projects.map((item) => (
                            <div key={item.id} className="flex items-start justify-between p-2 rounded-lg border border-slate-200 bg-slate-50 gap-2">
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold text-slate-800 truncate">{item.title}</h5>
                                <p className="text-[10px] text-slate-500 truncate">{item.subtitle}</p>
                              </div>
                              <button
                                onClick={() => removeProject(item.id)}
                                className="p-1 text-slate-400 hover:text-red-500 rounded-md transition hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-200 pt-3 space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <PlusCircle className="w-3.5 h-3.5 text-emerald-500" /> Add New Highlight
                      </h4>
                      <div>
                        <input
                          type="text"
                          placeholder="Project/Academic Title"
                          value={newProject.title}
                          onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Sub-header (e.g. Group presentations)"
                          value={newProject.subtitle}
                          onChange={(e) => setNewProject(prev => ({ ...prev, subtitle: e.target.value }))}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      
                      {/* Current list of bullets inside new project */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500">Bullets:</label>
                        {newProject.bullets.filter(b => b.trim() !== '').length > 0 && (
                          <div className="space-y-1 bg-slate-50 p-1.5 rounded-md border border-slate-150">
                            {newProject.bullets.map((bullet, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-1 text-[10px] text-slate-600 bg-white p-1 rounded border border-slate-100">
                                <span className="truncate flex-1">{bullet}</span>
                                <button type="button" onClick={() => removeBulletFromNewProject(idx)} className="text-red-500 hover:bg-red-50 p-0.5 rounded cursor-pointer">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-1.5 mt-1">
                          <input
                            type="text"
                            placeholder="Add bullet item description"
                            value={newBullet}
                            onChange={(e) => setNewBullet(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBulletToNewProject(); } }}
                            className="flex-1 px-2 py-1 border border-slate-300 rounded text-[11px] text-slate-800 focus:outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={addBulletToNewProject}
                            className="px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded text-[11px] font-medium cursor-pointer"
                          >
                            Add Bullet
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={addProject}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-md text-xs font-semibold shadow-xs cursor-pointer transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Project Highlight</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. Languages Tab */}
                {activeTab === 'languages' && (
                  <div className="space-y-4">
                    {/* List of current items */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Languages</h4>
                      {cvData.languages.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No languages added yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {cvData.languages.map((item) => (
                            <div key={item.id} className="flex items-start justify-between p-2 rounded-lg border border-slate-200 bg-slate-50 gap-2">
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold text-slate-800 truncate">{item.name}</h5>
                                <p className="text-[10px] text-slate-500 truncate">{item.proficiency}</p>
                              </div>
                              <button
                                onClick={() => removeLanguage(item.id)}
                                className="p-1 text-slate-400 hover:text-red-500 rounded-md transition hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-200 pt-3 space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <PlusCircle className="w-3.5 h-3.5 text-emerald-500" /> Add New Language
                      </h4>
                      <div>
                        <input
                          type="text"
                          placeholder="Language Name (e.g. Khmer)"
                          value={newLanguage.name}
                          onChange={(e) => setNewLanguage(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Proficiency (e.g. Native)"
                          value={newLanguage.proficiency}
                          onChange={(e) => setNewLanguage(prev => ({ ...prev, proficiency: e.target.value }))}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <button
                        onClick={addLanguage}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-md text-xs font-semibold shadow-xs cursor-pointer transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Language</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 7. Portfolio Links Tab */}
                {activeTab === 'links' && (
                  <div className="space-y-4">
                    {/* List of current items */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Portfolio Links</h4>
                      {cvData.portfolioLinks.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No links added yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {cvData.portfolioLinks.map((item) => (
                            <div key={item.id} className="flex items-start justify-between p-2 rounded-lg border border-slate-200 bg-slate-50 gap-2">
                              <div className="min-w-0 flex items-center gap-2">
                                <span className="text-blue-600">{getPlatformIcon(item.platform)}</span>
                                <div className="min-w-0">
                                  <h5 className="text-xs font-bold text-slate-800 truncate">{item.label}</h5>
                                  <p className="text-[10px] text-slate-400 truncate">{item.url}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => removeLink(item.id)}
                                className="p-1 text-slate-400 hover:text-red-500 rounded-md transition hover:bg-red-50 cursor-pointer shrink-0"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-200 pt-3 space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <PlusCircle className="w-3.5 h-3.5 text-emerald-500" /> Add New Link
                      </h4>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Platform Type</label>
                        <select
                          value={newLink.platform}
                          onChange={(e) => setNewLink(prev => ({ ...prev, platform: e.target.value as PortfolioLinkItem['platform'] }))}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="linkedin">LinkedIn</option>
                          <option value="github">GitHub</option>
                          <option value="telegram">Telegram</option>
                          <option value="website">Personal Website / Blog</option>
                          <option value="facebook">Facebook</option>
                          <option value="other">Other Link</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Link Label (e.g. My GitHub)"
                          value={newLink.label}
                          onChange={(e) => setNewLink(prev => ({ ...prev, label: e.target.value }))}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="url"
                          placeholder="Link URL (https://...)"
                          value={newLink.url}
                          onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <button
                        onClick={addLink}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-md text-xs font-semibold shadow-xs cursor-pointer transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Portfolio Link</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Sidebar footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                <button
                  onClick={printCV}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Ready to Print / Save PDF</span>
                </button>
                <p className="text-[10px] text-slate-400 mt-2">Print settings automatically strip away this editor panel.</p>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* 2. Right Interactive CV Document Page */}
        <main className="flex-1 w-full flex flex-col items-center">
          
          {/* Quick Notice above Document Page - Hidden on print */}
          <div className="no-print w-full max-w-3xl mb-4 bg-white border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Sparkles className="w-4.5 h-4.5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Direct Live Preview</h4>
                <p className="text-[11px] text-slate-500">Edit fields in the left bar or toggle themes to see visual upgrades instantly!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Layout:</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md capitalize">
                {activeThemeConfig.name}
              </span>
            </div>
          </div>

          {/* Actual Resume A4 Sheet Representation */}
          <div 
            id="cv-sheet"
            className={`print-container w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-lg p-0 transition-all duration-300 relative overflow-hidden flex flex-col min-h-[1050px] text-slate-800 ${activeThemeConfig.fontSans}`}
          >
            {/* Theme design accent line */}
            <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: activeThemeConfig.accentColor }} />

            {/* 1. Header Block (Name, Title, Address) */}
            <header className="px-10 py-10 md:px-12 md:py-10 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-end bg-slate-50 gap-4 relative">
              <div className="space-y-1.5 max-w-md">
                <motion.h1 
                  key={cvData.personalInfo.name}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900 uppercase leading-none`}
                  style={{ color: activeThemeConfig.primaryColor }}
                >
                  {cvData.personalInfo.name}
                </motion.h1>
                
                <motion.p 
                  key={cvData.personalInfo.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-semibold tracking-wide uppercase text-xs md:text-sm"
                  style={{ color: activeThemeConfig.accentColor }}
                >
                  {cvData.personalInfo.title}
                </motion.p>
              </div>

              {/* Physical Address Block */}
              <div className="text-left sm:text-right text-xs md:text-sm text-slate-500 font-medium">
                {cvData.personalInfo.address ? (
                  cvData.personalInfo.address.split(',').map((part, index) => (
                    <p key={index} className="leading-snug">{part.trim()}</p>
                  ))
                ) : (
                  <p>No address specified</p>
                )}
              </div>
            </header>

            {/* 2. Main Content Area (Split layout: Left Sidebar (1/3) vs Right Body (2/3)) */}
            <div className="flex-1 flex flex-col md:flex-row">
              
              {/* Left Column (Sidebar) - Contact details, Skills, Languages, Portfolio */}
              <aside className="w-full md:w-1/3 px-8 py-8 md:px-10 md:py-10 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/40 flex flex-col gap-8 shrink-0">
                
                {/* Profile Photo */}
                {cvData.personalInfo.showPhoto !== false && cvData.personalInfo.photoUrl && (
                  <div className="flex justify-center pb-2">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm bg-white">
                      <img 
                        src={cvData.personalInfo.photoUrl} 
                        alt={cvData.personalInfo.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</h3>
                  <div className="space-y-2.5 text-xs text-slate-600">
                    {/* Primary Phone */}
                    <div className="flex items-center gap-3">
                      <span className="w-4 font-bold text-slate-400 italic">P1:</span>
                      <span className="font-semibold text-slate-700">{cvData.personalInfo.phone1}</span>
                    </div>
                    {/* Secondary Phone */}
                    {cvData.personalInfo.phone2 && (
                      <div className="flex items-center gap-3">
                        <span className="w-4 font-bold text-slate-400 italic">P2:</span>
                        <span className="text-slate-700">{cvData.personalInfo.phone2}</span>
                      </div>
                    )}
                    {/* Primary Email */}
                    <div className="flex items-center gap-3">
                      <span className="w-4 font-bold text-slate-400 italic">E1:</span>
                      <a href={`mailto:${cvData.personalInfo.email1}`} className="font-semibold text-slate-700 hover:underline break-all">
                        {cvData.personalInfo.email1}
                      </a>
                    </div>
                    {/* Secondary Email */}
                    {cvData.personalInfo.email2 && (
                      <div className="flex items-center gap-3">
                        <span className="w-4 font-bold text-slate-400 italic">E2:</span>
                        <a href={`mailto:${cvData.personalInfo.email2}`} className="text-slate-600 hover:underline break-all">
                          {cvData.personalInfo.email2}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Core Skills Section */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Core Skills</h3>
                  <div className="space-y-3.5">
                    {cvData.skills.map((item) => (
                      <div key={item.id} className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                        {item.description && (
                          <p className="text-[11px] text-slate-500 leading-relaxed">{item.description}</p>
                        )}
                      </div>
                    ))}
                    {cvData.skills.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No skills added yet.</p>
                    )}
                  </div>
                </div>

                {/* Languages Section */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Languages</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {cvData.languages.map((item) => (
                      <span 
                        key={item.id} 
                        className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700"
                      >
                        {item.name} ({item.proficiency})
                      </span>
                    ))}
                    {cvData.languages.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No languages added yet.</p>
                    )}
                  </div>
                </div>

                {/* Portfolio Links Section */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portfolio Links</h3>
                  <div className="space-y-2">
                    {cvData.portfolioLinks.map((item) => (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-2 rounded bg-white border border-slate-200/60 hover:border-slate-300 hover:bg-slate-50/50 transition-all gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="text-slate-500 group-hover:text-blue-600 transition-colors shrink-0">
                            {getPlatformIcon(item.platform)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[10px] font-bold text-slate-800 truncate">{item.label}</h4>
                            <p className="text-[8px] text-slate-400 truncate">{item.url.replace(/^https?:\/\//i, '')}</p>
                          </div>
                        </div>
                        <ExternalLink className="w-2.5 h-2.5 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                      </a>
                    ))}
                    {cvData.portfolioLinks.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No portfolio links added yet.</p>
                    )}
                  </div>
                </div>

              </aside>

              {/* Right Column (Body / Experience) - Summary, Education, Projects */}
              <main className="flex-1 px-8 py-8 md:px-12 md:py-10 flex flex-col gap-8">
                
                {/* Professional Summary Section */}
                <section className="space-y-3">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Professional Summary</h3>
                  <motion.p 
                    key={cvData.personalInfo.summary}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-slate-600 leading-relaxed italic text-sm md:text-base text-justify text-slate-600 font-medium"
                  >
                    "{cvData.personalInfo.summary}"
                  </motion.p>
                </section>

                {/* Education Section */}
                <section className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Education</h3>
                  
                  <div className="relative pl-4 border-l-2" style={{ borderColor: activeThemeConfig.accentColor }}>
                    {cvData.education.map((item) => (
                      <div key={item.id} className="relative pb-6 last:pb-0 pl-4">
                        {/* Timeline Bullet Dot */}
                        <div 
                          className="absolute w-3 h-3 rounded-full -left-[23px] top-1.5 border-2 border-white animate-pulse"
                          style={{ backgroundColor: activeThemeConfig.accentColor }}
                        />
                        
                        <div className="space-y-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                            <h4 className="text-sm font-bold text-slate-900">{item.degree}</h4>
                            <span 
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full self-start"
                              style={{ backgroundColor: `${activeThemeConfig.accentColor}10`, color: activeThemeConfig.accentColor }}
                            >
                              {item.duration}
                            </span>
                          </div>
                          
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{item.institution}</p>
                          
                          {item.description && (
                            <p className="text-xs text-slate-500 leading-relaxed pt-0.5">{item.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {cvData.education.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No education details added yet. Click "Education" tab in customize panel.</p>
                    )}
                  </div>
                </section>

                {/* Academic Highlights & Projects Section */}
                <section className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Projects & Academic Highlights</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cvData.projects.map((item) => (
                      <div key={item.id} className="p-4 border border-slate-100 rounded-lg bg-slate-50/40 hover:bg-slate-50/80 transition-all space-y-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                          {item.subtitle && (
                            <p className="text-[10px] font-semibold text-slate-400 italic">{item.subtitle}</p>
                          )}
                        </div>
                        {item.bullets && item.bullets.length > 0 && (
                          <ul className="list-disc pl-4 space-y-1">
                            {item.bullets.map((bullet, index) => (
                              <li key={index} className="text-[11px] text-slate-600 leading-relaxed">
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                    {cvData.projects.length === 0 && (
                      <p className="text-xs text-slate-400 italic col-span-2">No project highlights added yet. Click "Projects" tab in customize panel.</p>
                    )}
                  </div>
                </section>

              </main>

            </div>

            {/* 3. Footer Block */}
            <footer className="h-16 px-10 md:px-12 border-t border-slate-100 flex items-center justify-between bg-slate-50/30 text-[10px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-400 uppercase tracking-wider font-semibold">Available for Immediate Start</span>
              </div>
              
              <div className="text-right">
                <span className="font-semibold text-slate-400 uppercase tracking-wider">References available upon request.</span>
              </div>
            </footer>

          </div>

          {/* Quick FAQ / Guide Section beneath preview - Hidden on print */}
          <div className="no-print w-full max-w-3xl mt-8 bg-slate-800 text-slate-300 rounded-2xl p-6 md:p-8 shadow-md">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-400" /> Tips for a Standout Resume
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-300 leading-relaxed">
              <div className="space-y-2.5">
                <p className="font-semibold text-slate-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  What is Digital Economy?
                </p>
                <p>
                  As a Digital Economy major, you specialize in how technology disrupts markets, digital businesses, e-commerce, and data-driven strategy. Highlight your digital literacy and quick learning ability!
                </p>
              </div>

              <div className="space-y-2.5">
                <p className="font-semibold text-slate-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Exporting to PDF:
                </p>
                <p>
                  Click the <strong>"Print / Save PDF"</strong> button at the top. In your system print prompt, set the Destination to <strong>"Save as PDF"</strong>. Under Options, enable <strong>"Background graphics"</strong> to capture all the beautiful theme colors!
                </p>
              </div>
            </div>
          </div>

        </main>

      </div>
    </div>
  );
}
