import React, { useState } from "react";
import {
  BarChart3,
  TreePine,
  Network,
  Code2,
  Home,
  ChevronLeft,
  Sparkles,
  BookOpen,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import ArrayVisualizer from "../components/Visualizer/ArrayVisualizer";
import TreeVisualizer from "../components/Visualizer/TreeVisualizer";
import GraphVisualizer from "../components/Visualizer/GraphVisualizer";
import Navbar from "../components/UI/Navbar";
import { useTheme } from "../contexts/ThemeContext";

type VisualizerType = "array" | "tree" | "graph" | null;

interface VisualizerCardProps {
  type: VisualizerType;
  icon: React.ReactNode;
  title: string;
  description: string;
  algorithms: string[];
  onClick: () => void;
  isDark: boolean;
}

const VisualizerCard: React.FC<VisualizerCardProps> = ({
  icon,
  title,
  description,
  algorithms,
  onClick,
  isDark,
}) => (
  <div
    onClick={onClick}
    className={`group cursor-pointer rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1 ${
      isDark
        ? "bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
        : "bg-white border border-slate-200 shadow-md hover:border-blue-300 hover:shadow-xl"
    }`}
  >
    <div className="flex items-start gap-4">
      <div
        className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${
          isDark
            ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400"
            : "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <h3
          className={`text-xl font-bold mb-2 transition-colors ${
            isDark
              ? "text-white group-hover:text-cyan-400"
              : "text-slate-900 group-hover:text-blue-600"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-sm mb-4 ${
            isDark ? "text-gray-400" : "text-slate-600"
          }`}
        >
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {algorithms.map((algo) => (
            <span
              key={algo}
              className={`px-2 py-1 text-xs rounded-lg ${
                isDark
                  ? "bg-gray-700/50 text-gray-300"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {algo}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const DSAVisualizer: React.FC = () => {
  const [activeVisualizer, setActiveVisualizer] =
    useState<VisualizerType>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const renderVisualizer = () => {
    switch (activeVisualizer) {
      case "array":
        return <ArrayVisualizer />;
      case "tree":
        return <TreeVisualizer />;
      case "graph":
        return <GraphVisualizer />;
      default:
        return null;
    }
  };

  if (activeVisualizer) {
    return (
      <div
        className={`h-screen flex flex-col ${
          isDark ? "bg-gray-900" : "bg-slate-50"
        }`}
      >
        {/* Navbar */}
        <Navbar />

        {/* Header */}
        <header
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveVisualizer(null)}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? "hover:bg-gray-700" : "hover:bg-slate-100"
              }`}
            >
              <ChevronLeft
                className={`w-5 h-5 ${
                  isDark ? "text-gray-400" : "text-slate-500"
                }`}
              />
            </button>
            <div className="flex items-center gap-3">
              {activeVisualizer === "array" && (
                <BarChart3 className="w-6 h-6 text-cyan-500" />
              )}
              {activeVisualizer === "tree" && (
                <TreePine className="w-6 h-6 text-cyan-500" />
              )}
              {activeVisualizer === "graph" && (
                <Network className="w-6 h-6 text-cyan-500" />
              )}
              <h1
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {activeVisualizer === "array" && "Sorting Algorithms"}
                {activeVisualizer === "tree" && "Tree Operations"}
                {activeVisualizer === "graph" && "Graph Algorithms"}
              </h1>
            </div>
          </div>
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDark
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </header>

        {/* Visualizer Content */}
        <div className="flex-1 overflow-hidden">{renderVisualizer()}</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-slate-50"}`}>
      {/* Navbar */}
      <Navbar />

      {/* Hero Header */}
      <header className="relative overflow-hidden">
        {/* Background Gradient */}
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10"
              : "bg-gradient-to-br from-cyan-100/50 via-blue-50 to-purple-100/50"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent"
              : "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/50 via-transparent to-transparent"
          }`}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-12">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-12">
            <Link
              to="/"
              className={`flex items-center gap-2 transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/problemset"
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              <Code2 className="w-5 h-5" />
              <span>Practice Problems</span>
            </Link>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-500 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Learning Platform</span>
            </div>

            <h1
              className={`text-5xl md:text-6xl font-bold mb-6 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              DSA{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Visualizer
              </span>
            </h1>

            <p
              className={`text-xl mb-8 max-w-2xl mx-auto ${
                isDark ? "text-gray-400" : "text-slate-600"
              }`}
            >
              Master Data Structures and Algorithms through interactive
              visualizations. See how algorithms work step by step.
            </p>

            <div
              className={`flex flex-wrap justify-center gap-4 text-sm ${
                isDark ? "text-gray-400" : "text-slate-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-500" />
                <span>Step-by-step animations</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Real-time visualization</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-green-500" />
                <span>Complexity analysis</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Visualizer Cards */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VisualizerCard
            type="array"
            icon={<BarChart3 className="w-8 h-8" />}
            title="Sorting Algorithms"
            description="Visualize how different sorting algorithms organize data. Compare performance and understand their mechanics."
            algorithms={[
              "Bubble Sort",
              "Selection Sort",
              "Insertion Sort",
              "Quick Sort",
            ]}
            onClick={() => setActiveVisualizer("array")}
            isDark={isDark}
          />

          <VisualizerCard
            type="tree"
            icon={<TreePine className="w-8 h-8" />}
            title="Tree Operations"
            description="Explore Binary Search Trees with insertions, deletions, and traversal animations."
            algorithms={[
              "BST Insert",
              "BST Delete",
              "In-Order",
              "Pre-Order",
              "Post-Order",
              "Level-Order",
            ]}
            onClick={() => setActiveVisualizer("tree")}
            isDark={isDark}
          />

          <VisualizerCard
            type="graph"
            icon={<Network className="w-8 h-8" />}
            title="Graph Algorithms"
            description="Understand graph traversal and pathfinding algorithms with interactive visualizations."
            algorithms={["BFS", "DFS", "Dijkstra's"]}
            onClick={() => setActiveVisualizer("graph")}
            isDark={isDark}
          />
        </div>

        {/* Features Section */}
        <section className="mt-20">
          <h2
            className={`text-3xl font-bold text-center mb-12 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Why Use Our Visualizer?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className={`rounded-xl p-6 text-center ${
                isDark
                  ? "bg-gray-800/50 border border-gray-700"
                  : "bg-white border border-slate-200 shadow-md"
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-cyan-500" />
              </div>
              <h3
                className={`text-lg font-semibold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Visual Learning
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-slate-600"
                }`}
              >
                See algorithms in action with beautiful animations
              </p>
            </div>

            <div
              className={`rounded-xl p-6 text-center ${
                isDark
                  ? "bg-gray-800/50 border border-gray-700"
                  : "bg-white border border-slate-200 shadow-md"
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-500" />
              </div>
              <h3
                className={`text-lg font-semibold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Speed Control
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-slate-600"
                }`}
              >
                Adjust animation speed to match your learning pace
              </p>
            </div>

            <div
              className={`rounded-xl p-6 text-center ${
                isDark
                  ? "bg-gray-800/50 border border-gray-700"
                  : "bg-white border border-slate-200 shadow-md"
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Code2 className="w-6 h-6 text-purple-500" />
              </div>
              <h3
                className={`text-lg font-semibold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Code & Complexity
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-slate-600"
                }`}
              >
                View pseudocode and time/space complexity
              </p>
            </div>

            <div
              className={`rounded-xl p-6 text-center ${
                isDark
                  ? "bg-gray-800/50 border border-gray-700"
                  : "bg-white border border-slate-200 shadow-md"
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-yellow-500" />
              </div>
              <h3
                className={`text-lg font-semibold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Step by Step
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-slate-600"
                }`}
              >
                Navigate forward and backward through each step
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <div
            className={`rounded-2xl p-12 ${
              isDark
                ? "bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-gray-700"
                : "bg-gradient-to-r from-cyan-50 via-blue-50 to-purple-50 border border-slate-200"
            }`}
          >
            <h2
              className={`text-3xl font-bold mb-4 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Ready to Practice?
            </h2>
            <p
              className={`mb-8 max-w-xl mx-auto ${
                isDark ? "text-gray-400" : "text-slate-600"
              }`}
            >
              After understanding the algorithms, put your knowledge to the test
              with our coding challenges.
            </p>
            <Link
              to="/problemset"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105"
            >
              <Code2 className="w-5 h-5" />
              Start Solving Problems
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-8 mt-12 ${
          isDark ? "border-gray-800" : "border-slate-200"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-6 text-center text-sm ${
            isDark ? "text-gray-500" : "text-slate-500"
          }`}
        >
          <p>Built with ❤️ for developers who want to master DSA</p>
        </div>
      </footer>
    </div>
  );
};

export default DSAVisualizer;
