// Niche Technology Resources - Only Few People Specialize
export const techResources = {
  quantum: {
    name: "Quantum Computing",
    difficulty: "Expert",
    popularity: "1% of developers",
    resources: [
      { title: "Qiskit Documentation", url: "https://qiskit.org", type: "framework" },
      { title: "IBM Quantum Network", url: "https://quantum.ibm.com", type: "platform" },
      { title: "Quantum Computing Fundamentals", url: "https://www.coursera.org/learn/quantum-computing-fundamentals", type: "course" },
    ],
  },
  fpga: {
    name: "FPGA & Hardware Design",
    difficulty: "Expert",
    popularity: "2% of developers",
    resources: [
      { title: "Verilog/SystemVerilog Guide", url: "https://verilog.com", type: "guide" },
      { title: "Vivado Design Suite", url: "https://www.xilinx.com/products/design-tools/vivado.html", type: "tool" },
      { title: "FPGA Design with Chisel", url: "https://github.com/chipsalliance/chisel", type: "framework" },
    ],
  },
  biotech: {
    name: "Biotech & Bioinformatics",
    difficulty: "Hard",
    popularity: "3% of developers",
    resources: [
      { title: "BioPython", url: "https://biopython.org", type: "framework" },
      { title: "GATK Toolkit", url: "https://gatk.broadinstitute.org", type: "tool" },
      { title: "Bioinformatics Specialization", url: "https://www.coursera.org/specializations/bioinformatics", type: "course" },
    ],
  },
  vrar: {
    name: "AR/VR Development",
    difficulty: "Hard",
    popularity: "5% of developers",
    resources: [
      { title: "Unity XR Plugin", url: "https://docs.unity3d.com/Manual/XR.html", type: "framework" },
      { title: "Unreal Engine MetaHuman", url: "https://www.unrealengine.com/en-US/metahuman", type: "framework" },
      { title: "WebXR API", url: "https://immersiveweb.github.io", type: "api" },
    ],
  },
  robotics: {
    name: "Robotics & Automation",
    difficulty: "Hard",
    popularity: "4% of developers",
    resources: [
      { title: "ROS (Robot Operating System)", url: "https://www.ros.org", type: "framework" },
      { title: "ROS2 Documentation", url: "https://docs.ros.org/en/humble", type: "documentation" },
      { title: "Robotics Manipulation", url: "https://manipulation.csail.mit.edu", type: "course" },
    ],
  },
  iot: {
    name: "IoT & Embedded Systems",
    difficulty: "Hard",
    popularity: "6% of developers",
    resources: [
      { title: "Arduino Reference", url: "https://www.arduino.cc/reference", type: "documentation" },
      { title: "Embedded Rust Book", url: "https://docs.rust-embedded.org", type: "book" },
      { title: "MQTT Protocol Guide", url: "https://mqtt.org", type: "protocol" },
    ],
  },
  distributed: {
    name: "Distributed Systems",
    difficulty: "Expert",
    popularity: "7% of developers",
    resources: [
      { title: "Designing Data-Intensive Applications", url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063", type: "book" },
      { title: "Raft Consensus", url: "https://raft.github.io", type: "algorithm" },
      { title: "MIT 6.824: Distributed Systems", url: "https://pdos.csail.mit.edu/6.824", type: "course" },
    ],
  },
  lowlevel: {
    name: "Low-Level Systems Programming",
    difficulty: "Expert",
    popularity: "5% of developers",
    resources: [
      { title: "Linux Kernel Development", url: "https://www.kernel.org", type: "project" },
      { title: "Writing an OS in Rust", url: "https://os.phil-opp.com", type: "book" },
      { title: "Computer Systems: A Programmer's Perspective", url: "https://csapp.cs.cmu.edu", type: "book" },
    ],
  },
  wasm: {
    name: "WebAssembly & Rust",
    difficulty: "Hard",
    popularity: "8% of developers",
    resources: [
      { title: "wasm-bindgen", url: "https://rustwasm.github.io/docs/wasm-bindgen", type: "framework" },
      { title: "Yew Framework", url: "https://yew.rs", type: "framework" },
      { title: "WebAssembly Specification", url: "https://webassembly.org", type: "spec" },
    ],
  },
  formalverif: {
    name: "Formal Verification",
    difficulty: "Expert",
    popularity: "1% of developers",
    resources: [
      { title: "TLA+ Specification Language", url: "https://lamport.azurewebsites.net/tla/tla.html", type: "language" },
      { title: "Z3 Theorem Prover", url: "https://github.com/Z3Prover/z3", type: "tool" },
      { title: "Formal Methods for Software Engineering", url: "https://www.coursera.org/learn/formal-methods", type: "course" },
    ],
  },
  compiler: {
    name: "Compiler Design",
    difficulty: "Expert",
    popularity: "2% of developers",
    resources: [
      { title: "Crafting Interpreters", url: "https://craftinginterpreters.com", type: "book" },
      { title: "LLVM Project", url: "https://llvm.org", type: "framework" },
      { title: "Compiler Design Course", url: "https://www.edx.org/course/compilers-design-for-high-performance", type: "course" },
    ],
  },
  hpc: {
    name: "High-Performance Computing",
    difficulty: "Expert",
    popularity: "3% of developers",
    resources: [
      { title: "CUDA Programming", url: "https://developer.nvidia.com/cuda-toolkit", type: "framework" },
      { title: "OpenMP Specification", url: "https://www.openmp.org", type: "spec" },
      { title: "HPC Best Practices", url: "https://hpc.llnl.gov", type: "guide" },
    ],
  },
  hardware: {
    name: "Hardware Hacking",
    difficulty: "Hard",
    popularity: "2% of developers",
    resources: [
      { title: "Hackaday Projects", url: "https://hackaday.com/projects", type: "community" },
      { title: "Electronics Learning", url: "https://learn.adafruit.com", type: "tutorials" },
      { title: "Reverse Engineering Guide", url: "https://reverse.put.as", type: "guide" },
    ],
  },
  physics: {
    name: "Applied Physics & Computational Physics",
    difficulty: "Expert",
    popularity: "2% of developers",
    resources: [
      { title: "Physics Engine Development", url: "https://www.bulletphysics.org", type: "framework" },
      { title: "OpenFOAM CFD Simulation", url: "https://www.openfoam.com", type: "tool" },
      { title: "MIT Physics OpenCourseWare", url: "https://ocw.mit.edu/courses/physics", type: "course" },
      { title: "Quantum Mechanics Simulation", url: "https://quantumcomputing.ibm.com", type: "platform" },
      { title: "Classical Mechanics - Landau & Lifshitz", url: "https://www.amazon.com/Mechanics-Course-Theoretical-Physics-Vol-1", type: "book" },
    ],
    deeperTopics: [
      { name: "Computational Fluid Dynamics", level: "Advanced", tools: ["OpenFOAM", "ANSYS Fluent", "COMSOL"] },
      { name: "Molecular Dynamics Simulation", level: "Advanced", tools: ["GROMACS", "LAMMPS", "NAMD"] },
      { name: "Quantum Mechanics", level: "Expert", tools: ["QuTiP", "Qiskit", "PennyLane"] },
      { name: "Particle Physics Simulation", level: "Expert", tools: ["Geant4", "ROOT", "Pythia8"] },
    ],
  },
  maths: {
    name: "Advanced Mathematics & Numerical Analysis",
    difficulty: "Expert",
    popularity: "3% of developers",
    resources: [
      { title: "SageMath Computer Algebra", url: "https://www.sagemath.org", type: "tool" },
      { title: "SymPy Symbolic Mathematics", url: "https://www.sympy.org", type: "framework" },
      { title: "MIT Computational Mathematics", url: "https://ocw.mit.edu/courses/mathematics", type: "course" },
      { title: "Numerical Recipes in C++", url: "http://numerical.recipes", type: "book" },
      { title: "Coq Theorem Prover", url: "https://coq.inria.fr", type: "tool" },
    ],
    deeperTopics: [
      { name: "Numerical Linear Algebra", level: "Advanced", tools: ["BLAS", "LAPACK", "Eigen", "NumPy"] },
      { name: "Differential Equations", level: "Advanced", tools: ["SciPy", "Assimulo", "DifferentialEquations.jl"] },
      { name: "Formal Verification & Proofs", level: "Expert", tools: ["Coq", "Lean", "Isabelle/HOL"] },
      { name: "Optimization & Control Theory", level: "Expert", tools: ["CVX", "CVXOPT", "YALMIP"] },
      { name: "Abstract Algebra & Group Theory", level: "Expert", tools: ["GAP", "Magma", "SageMath"] },
    ],
  },
};

export async function getTechResources() {
  return {
    resources: techResources,
    total: Object.keys(techResources).length,
    raretechCount: Object.keys(techResources).length - 8,
  };
}

export async function getTechResourceDetail(resourceId: string) {
  const resource = techResources[resourceId as keyof typeof techResources];
  if (!resource) return null;
  return {
    id: resourceId,
    ...resource,
  };
}
