'use client'

import { useState } from 'react'
import { MoneyTip } from '@/types'
import { Lightbulb, DollarSign, PiggyBank, ChevronDown, ChevronUp } from 'lucide-react'

const moneyTips: MoneyTip[] = [
  // Earning Tips
  {
    id: 'earn-1',
    title: 'Sell Unused Gear',
    description: 'Clear out your garage and sell old bikes, running shoes, or equipment on Facebook Marketplace, eBay, or local buy/sell groups.',
    category: 'earn',
    icon: 'recycle',
  },
  {
    id: 'earn-2',
    title: 'Freelance Your Skills',
    description: 'Offer coaching, training plans, or nutrition advice to other athletes. Platforms like Fiverr and Upwork make it easy to get started.',
    category: 'earn',
    icon: 'briefcase',
  },
  {
    id: 'earn-3',
    title: 'Race Photography/Videography',
    description: 'If you have photo/video skills, offer to capture other athletes\' race moments and sell the content.',
    category: 'earn',
    icon: 'camera',
  },
  {
    id: 'earn-4',
    title: 'Part-Time Bike Shop Work',
    description: 'Work at a local bike shop for employee discounts on gear while earning extra cash.',
    category: 'earn',
    icon: 'wrench',
  },
  {
    id: 'earn-5',
    title: 'Create Training Content',
    description: 'Start a YouTube channel or blog documenting your journey. Once you build an audience, monetize through ads and sponsorships.',
    category: 'earn',
    icon: 'video',
  },
  {
    id: 'earn-6',
    title: 'Race Volunteering Benefits',
    description: 'Volunteer at races - many offer free race entries or discounts for volunteers.',
    category: 'earn',
    icon: 'heart',
  },
  {
    id: 'earn-7',
    title: 'Sponsor Fundraising',
    description: 'Race for a charity and let friends/family sponsor your training. Many Ironman events support charitable causes.',
    category: 'earn',
    icon: 'users',
  },
  {
    id: 'earn-8',
    title: 'Rent Out Equipment',
    description: 'Rent your wetsuit, bike, or other gear when not in use through platforms like Spinlister.',
    category: 'earn',
    icon: 'refresh',
  },

  // Saving Tips
  {
    id: 'save-1',
    title: 'Buy Used Gear',
    description: 'Purchase gently used bikes, wetsuits, and equipment. Check local tri clubs, Facebook groups, and eBay for deals.',
    category: 'save',
    icon: 'tag',
  },
  {
    id: 'save-2',
    title: 'DIY Nutrition',
    description: 'Make your own energy bars, gels, and drinks instead of buying expensive branded products. Pinterest has tons of recipes!',
    category: 'save',
    icon: 'apple',
  },
  {
    id: 'save-3',
    title: 'Join a Tri Club',
    description: 'Members often get discounts on race entries, coaching, and gear through club partnerships.',
    category: 'save',
    icon: 'users',
  },
  {
    id: 'save-4',
    title: 'Early Bird Registration',
    description: 'Register for races early to get the lowest prices. Ironman prices increase as race day approaches.',
    category: 'save',
    icon: 'clock',
  },
  {
    id: 'save-5',
    title: 'Pool Swims vs. Open Water',
    description: 'Train in free public pools instead of paying for open water swim access or pool memberships.',
    category: 'save',
    icon: 'waves',
  },
  {
    id: 'save-6',
    title: 'Share Lodging',
    description: 'Split hotel/Airbnb costs with other athletes when traveling to races.',
    category: 'save',
    icon: 'home',
  },
  {
    id: 'save-7',
    title: 'Free Training Plans',
    description: 'Use free online training plans instead of expensive coaching. Resources like 80/20 Endurance and TrainingPeaks have free options.',
    category: 'save',
    icon: 'book',
  },
  {
    id: 'save-8',
    title: 'Meal Prep',
    description: 'Prepare meals in bulk to avoid expensive restaurant meals during training. Good nutrition doesn\'t have to be costly.',
    category: 'save',
    icon: 'utensils',
  },
  {
    id: 'save-9',
    title: 'Automate Savings',
    description: 'Set up automatic transfers of $10-50/week from checking to your race fund. You won\'t miss what you don\'t see!',
    category: 'save',
    icon: 'trending-up',
  },
  {
    id: 'save-10',
    title: 'Off-Season Gear Sales',
    description: 'Buy winter gear in summer and summer gear in winter when retailers heavily discount seasonal items.',
    category: 'save',
    icon: 'percent',
  },
]

export default function MoneyTips() {
  const [activeTab, setActiveTab] = useState<'earn' | 'save'>('earn')
  const [expandedTip, setExpandedTip] = useState<string | null>(null)

  const filteredTips = moneyTips.filter(tip => tip.category === activeTab)

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neon-green text-glow-green">
          Money Tips
        </h2>
        <Lightbulb className="w-6 h-6 text-neon-green" />
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('earn')}
          className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'earn'
              ? 'bg-neon-blue/20 border border-neon-blue text-neon-blue shadow-neon-blue'
              : 'bg-dark-bg border border-dark-border text-gray-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Earn Money ({moneyTips.filter(t => t.category === 'earn').length})
        </button>
        <button
          onClick={() => setActiveTab('save')}
          className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'save'
              ? 'bg-neon-green/20 border border-neon-green text-neon-green shadow-neon-green'
              : 'bg-dark-bg border border-dark-border text-gray-400 hover:text-white'
          }`}
        >
          <PiggyBank className="w-4 h-4" />
          Save Money ({moneyTips.filter(t => t.category === 'save').length})
        </button>
      </div>

      {/* Tips List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        {filteredTips.map((tip, index) => (
          <div
            key={tip.id}
            className={`bg-dark-bg rounded-lg border transition-all ${
              expandedTip === tip.id
                ? activeTab === 'earn'
                  ? 'border-neon-blue'
                  : 'border-neon-green'
                : 'border-dark-border hover:border-gray-600'
            }`}
          >
            <button
              onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeTab === 'earn'
                      ? 'bg-neon-blue/20 text-neon-blue'
                      : 'bg-neon-green/20 text-neon-green'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`font-semibold ${
                    expandedTip === tip.id
                      ? activeTab === 'earn'
                        ? 'text-neon-blue'
                        : 'text-neon-green'
                      : 'text-white'
                  }`}
                >
                  {tip.title}
                </span>
              </div>
              {expandedTip === tip.id ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedTip === tip.id && (
              <div className="px-4 pb-4">
                <p className="text-gray-300 text-sm leading-relaxed ml-11">
                  {tip.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Summary */}
      <div className="mt-6 pt-6 border-t border-dark-border">
        <div className="bg-gradient-neon rounded-lg p-4">
          <p className="text-sm text-gray-300 text-center">
            <span className="font-bold text-neon-blue">Pro Tip:</span> Combine multiple
            strategies! Selling old gear + meal prep + early registration can save you{' '}
            <span className="font-bold text-neon-green">$500-1000+</span> on your Ironman
            journey.
          </p>
        </div>
      </div>
    </div>
  )
}
