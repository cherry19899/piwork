'use client';

import { useState } from 'react';
import { FirstConversationTemplate, ObjectionHandlers } from '@/lib/first-conversation-templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ConversationPlaybookUI() {
  const [currentStage, setCurrentStage] = useState(0);
  const [showObjections, setShowObjections] = useState(false);
  const [selectedObjection, setSelectedObjection] = useState<string | null>(null);

  const stages = FirstConversationTemplate.stages;
  const stage = stages[currentStage];
  const talkingPoints = FirstConversationTemplate.getTalkingPoints();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">PiWork First Conversation Playbook</h1>
          <p className="text-lg text-muted-foreground">
            Scripts, objection handlers, and metrics for founder-led GTM
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="script" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="script">Live Script</TabsTrigger>
            <TabsTrigger value="objections">Handle Objections</TabsTrigger>
            <TabsTrigger value="demo">Demo Flow</TabsTrigger>
          </TabsList>

          {/* Script Tab */}
          <TabsContent value="script" className="space-y-6">
            {/* Current Stage */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      Stage {currentStage + 1}: {stage.stage.charAt(0).toUpperCase() + stage.stage.slice(1)}
                    </CardTitle>
                    <CardDescription>
                      Target duration: {stage.duration_seconds} seconds
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {Math.round(((currentStage + 1) / stages.length) * 100)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg border">
                  <p className="text-base leading-relaxed whitespace-pre-wrap font-mono">
                    {stage.template}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                    ✓ Success metric: {stage.success_metric}
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStage(Math.max(0, currentStage - 1))}
                    disabled={currentStage === 0}
                  >
                    ← Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentStage(Math.min(stages.length - 1, currentStage + 1))}
                    disabled={currentStage === stages.length - 1}
                  >
                    Next →
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowObjections(true)}
                    className="ml-auto"
                  >
                    Handle Objection
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Talking Points */}
            <Card>
              <CardHeader>
                <CardTitle>Talking Points for This Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="competition_comparison">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="competition_comparison">Competition</TabsTrigger>
                    <TabsTrigger value="pi_advantages">Pi Benefits</TabsTrigger>
                    <TabsTrigger value="security_points">Security</TabsTrigger>
                    <TabsTrigger value="use_cases">Use Cases</TabsTrigger>
                  </TabsList>

                  {Object.entries(talkingPoints).map(([key, points]) => (
                    <TabsContent key={key} value={key} className="space-y-3">
                      {points.map((point, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-muted rounded-lg border-l-4 border-primary"
                        >
                          <p className="text-sm">{point}</p>
                        </div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Objections Tab */}
          <TabsContent value="objections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Objections & Responses</CardTitle>
                <CardDescription>
                  Click any objection to see the full handling script
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(ObjectionHandlers.handlers).map(([key, handler]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedObjection(selectedObjection === key ? null : key)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedObjection === key
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <p className="font-semibold">{handler.objection}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click to expand response
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Selected Objection Details */}
            {selectedObjection && ObjectionHandlers.handlers[selectedObjection] && (
              <Card className="border-2 border-yellow-200 dark:border-yellow-800">
                <CardHeader className="bg-yellow-50 dark:bg-yellow-950">
                  <CardTitle className="text-yellow-900 dark:text-yellow-100">
                    How to Handle: {ObjectionHandlers.handlers[selectedObjection].objection}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <h3 className="font-semibold mb-3">Your Response:</h3>
                    <div className="bg-muted p-4 rounded-lg border whitespace-pre-wrap font-mono text-sm leading-relaxed">
                      {ObjectionHandlers.handlers[selectedObjection].response}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Evidence to Share:</h3>
                    <ul className="space-y-2">
                      {ObjectionHandlers.handlers[selectedObjection].evidence.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      Next action: {ObjectionHandlers.handlers[selectedObjection].next_action}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Demo Flow Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>15-Minute Demo Flow</CardTitle>
                <CardDescription>
                  Complete walkthrough to show live on screen share
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-6 rounded-lg border whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-96 overflow-y-auto">
                  {FirstConversationTemplate.demoFlow()}
                </div>
                <Button className="w-full mt-6">Copy to Clipboard</Button>
              </CardContent>
            </Card>

            {/* Key Points */}
            <Card>
              <CardHeader>
                <CardTitle>Demo Success Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'Homepage visible with "2% fee" prominently displayed',
                    'Task creation process clear (5 fields max)',
                    'Escrow lock explained: "Your 50 Pi are safe"',
                    'Freelancer profile with rating shown',
                    'Real transaction on Pi blockchain explorer linked',
                    'User asks at least one question',
                    'Get Pi username before demo ends',
                  ].map((item, idx) => (
                    <label key={idx} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-primary"
                        defaultChecked={false}
                      />
                      <span className="text-sm">{item}</span>
                    </label>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Stats */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">6</p>
                <p className="text-sm text-muted-foreground">Conversation stages</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">7</p>
                <p className="text-sm text-muted-foreground">Objection handlers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">15 min</p>
                <p className="text-sm text-muted-foreground">Complete demo flow</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
