export type ObjectiveQuestion = {
  id: string;
  prompt: string;
  sentence: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  passage?: string;
};

export type ObjectiveQuestionSet = {
  id: string;
  label: string;
  questions: ObjectiveQuestion[];
};

export type WritingPrompt = {
  id: string;
  label: string;
  title: string;
  prompt: string;
  helper: string;
  guidance: string;
};

export const grammarLabQuestions: ObjectiveQuestion[] = [
  {
    id: "subject-verb",
    prompt: "Choose the sentence with correct subject-verb agreement.",
    sentence: "The goal is to spot the sentence that matches a singular subject with the correct verb.",
    options: [
      "The list of new words are on the board.",
      "The list of new words is on the board.",
      "The list of new words were on the board.",
      "The list of new words have on the board."
    ],
    correctIndex: 1,
    explanation: "The subject is 'list', which is singular, so the verb should be 'is'."
  },
  {
    id: "tense-choice",
    prompt: "Pick the best tense for a completed action yesterday.",
    sentence: "Yesterday, Aisyah ____ her grammar notes before dinner.",
    options: ["reviews", "has reviewed", "reviewed", "is reviewing"],
    correctIndex: 2,
    explanation: "A finished action in the past with a time marker like 'yesterday' needs the simple past tense."
  },
  {
    id: "article-use",
    prompt: "Choose the most accurate article usage.",
    sentence: "Farid wants to be ____ engineer when he finishes school.",
    options: ["a", "an", "the", "no article"],
    correctIndex: 1,
    explanation: "'Engineer' starts with a vowel sound, so the correct article is 'an'."
  }
];

export const grammarLabQuestionsSetB: ObjectiveQuestion[] = [
  {
    id: "grammar-plural-noun",
    prompt: "Choose the sentence with the correct plural noun usage.",
    sentence: "Find the sentence that uses the plural form correctly.",
    options: [
      "Many childs enjoy the after-school reading club.",
      "Many children enjoy the after-school reading club.",
      "Many childrens enjoy the after-school reading club.",
      "Many child enjoy the after-school reading club."
    ],
    correctIndex: 1,
    explanation: "The correct plural form of 'child' is 'children'."
  },
  {
    id: "grammar-preposition",
    prompt: "Pick the correct preposition.",
    sentence: "The students waited ____ the hall before assembly started.",
    options: ["on", "at", "in", "for"],
    correctIndex: 2,
    explanation: "Students wait 'in' the hall because it refers to being inside the space."
  },
  {
    id: "grammar-pronoun",
    prompt: "Choose the correct pronoun to complete the sentence.",
    sentence: "Aina and Farah finished the project by ____.",
    options: ["herself", "ourselves", "themselves", "itself"],
    correctIndex: 2,
    explanation: "The subject is plural, so the correct reflexive pronoun is 'themselves'."
  }
];

export const tatabahasaQuestions: ObjectiveQuestion[] = [
  {
    id: "imbuhan",
    prompt: "Pilih ayat yang menggunakan imbuhan dengan betul.",
    sentence: "Cari ayat yang menggunakan kata kerja berimbuhan secara tepat.",
    options: [
      "Murid itu sedang membacakan buku cerita di perpustakaan.",
      "Murid itu sedang membaca buku cerita di perpustakaan.",
      "Murid itu sedang pembaca buku cerita di perpustakaan.",
      "Murid itu sedang terbaca buku cerita di perpustakaan."
    ],
    correctIndex: 1,
    explanation: "Kata kerja yang tepat ialah 'membaca' kerana subjek sedang melakukan perbuatan itu."
  },
  {
    id: "penjodoh",
    prompt: "Pilih penjodoh bilangan yang paling sesuai.",
    sentence: "Ibu membeli tiga ____ rambutan di pasar pagi.",
    options: ["biji", "helai", "ulas", "batang"],
    correctIndex: 0,
    explanation: "Buah rambutan biasanya dipadankan dengan penjodoh bilangan 'biji'."
  },
  {
    id: "kata-hubung",
    prompt: "Pilih kata hubung yang paling tepat untuk melengkapkan ayat.",
    sentence: "Nadia tetap hadir ke kelas tambahan ____ hujan turun dengan lebat.",
    options: ["kerana", "walaupun", "supaya", "lalu"],
    correctIndex: 1,
    explanation: "'Walaupun' menunjukkan pertentangan antara hujan lebat dengan tindakan Nadia yang tetap hadir."
  }
];

export const tatabahasaQuestionsSetB: ObjectiveQuestion[] = [
  {
    id: "bm-kata-adjektif",
    prompt: "Pilih kata adjektif yang paling sesuai.",
    sentence: "Cuaca pada pagi itu sangat ____ dan nyaman.",
    options: ["indah", "bermain", "menulis", "berjalan"],
    correctIndex: 0,
    explanation: "'Indah' ialah kata adjektif yang sesuai untuk menerangkan cuaca."
  },
  {
    id: "bm-ayat-pasif",
    prompt: "Pilih ayat pasif yang betul.",
    sentence: "Cari struktur ayat pasif yang tepat.",
    options: [
      "Buku itu membaca oleh murid itu.",
      "Buku itu dibaca oleh murid itu.",
      "Buku itu terbaca oleh murid itu membaca.",
      "Buku itu murid itu dibaca."
    ],
    correctIndex: 1,
    explanation: "Ayat pasif yang betul ialah 'Buku itu dibaca oleh murid itu'."
  },
  {
    id: "bm-penanda-wacana",
    prompt: "Pilih penanda wacana yang paling sesuai.",
    sentence: "____, murid-murid perlu mengulang kaji setiap hari untuk berjaya.",
    options: ["Oleh itu", "Kerusi", "Walaupun", "Kemudianlah"],
    correctIndex: 0,
    explanation: "'Oleh itu' sesuai digunakan untuk menunjukkan kesimpulan atau akibat."
  }
];

const bmPassage =
  "Sekolah Taman Murni melancarkan sudut bacaan pagi untuk membantu murid membina tabiat membaca sebelum kelas bermula. Pada minggu pertama, hanya beberapa orang murid yang datang lebih awal. Namun begitu, selepas guru-guru mula berkongsi cadangan buku dan memberi peluang kepada murid menceritakan isi bacaan mereka, semakin ramai murid tertarik untuk turut serta. Pihak sekolah mendapati bahawa murid yang aktif membaca lebih berani memberikan pendapat semasa perbincangan kelas. Oleh itu, program tersebut diteruskan setiap minggu dan dijadikan sebahagian daripada budaya sekolah.";

export const pemahamanQuestions: ObjectiveQuestion[] = [
  {
    id: "bm-main-idea",
    prompt: "Apakah idea utama petikan ini?",
    sentence: "Pilih ringkasan yang paling tepat bagi keseluruhan petikan.",
    passage: bmPassage,
    options: [
      "Sekolah mahu menutup perpustakaan kerana murid tidak suka membaca.",
      "Program bacaan pagi membantu murid membina keyakinan dan budaya membaca.",
      "Murid hanya membaca apabila peperiksaan semakin hampir.",
      "Guru melarang murid berkongsi pendapat dalam kelas."
    ],
    correctIndex: 1,
    explanation: "Petikan menekankan bahawa program bacaan pagi berjaya menggalakkan membaca dan keyakinan murid."
  },
  {
    id: "bm-detail",
    prompt: "Maklumat manakah menunjukkan program itu berjaya?",
    sentence: "Pilih bukti yang paling kuat daripada petikan.",
    passage: bmPassage,
    options: [
      "Hanya beberapa murid datang pada minggu pertama.",
      "Guru-guru berkongsi cadangan buku dengan murid.",
      "Murid yang aktif membaca lebih berani memberikan pendapat dalam kelas.",
      "Program itu dijalankan sebelum kelas bermula."
    ],
    correctIndex: 2,
    explanation: "Butiran ini menunjukkan perubahan positif pada keyakinan dan penglibatan murid."
  },
  {
    id: "bm-inference",
    prompt: "Apakah kesimpulan yang paling munasabah berdasarkan petikan?",
    sentence: "Pilih inferens yang paling sesuai.",
    passage: bmPassage,
    options: [
      "Program itu diteruskan kerana memberi kesan baik kepada murid.",
      "Murid terpaksa membaca kerana takut dihukum.",
      "Semua murid sudah mahir membaca sejak awal lagi.",
      "Guru tidak lagi menjalankan perbincangan kelas."
    ],
    correctIndex: 0,
    explanation: "Program diteruskan kerana sekolah melihat manfaatnya terhadap murid dan budaya pembelajaran."
  }
];

const bmPassageSetB =
  "Persatuan Sains sekolah menganjurkan projek kebun mini untuk mengajar murid tentang penjagaan alam sekitar. Pada awalnya, hanya ahli persatuan yang terlibat. Selepas beberapa minggu, murid-murid lain mula membantu menyiram pokok dan membersihkan kawasan kebun. Guru mendapati projek itu bukan sahaja mencantikkan sekolah, malah mengajar murid tentang tanggungjawab dan kerjasama. Oleh sebab sambutannya menggalakkan, pihak sekolah merancang untuk menambah lebih banyak tanaman herba pada masa hadapan.";

export const pemahamanQuestionsSetB: ObjectiveQuestion[] = [
  {
    id: "bm-b-main-idea",
    prompt: "Apakah idea utama petikan ini?",
    sentence: "Pilih ringkasan terbaik bagi keseluruhan petikan.",
    passage: bmPassageSetB,
    options: [
      "Projek kebun mini membantu mencantikkan sekolah dan membina nilai tanggungjawab.",
      "Semua murid dikehendaki menjadi ahli Persatuan Sains.",
      "Guru tidak lagi membenarkan murid menjaga tanaman di sekolah.",
      "Sekolah hanya menanam herba untuk dijual."
    ],
    correctIndex: 0,
    explanation: "Petikan menekankan manfaat projek kebun mini terhadap sekolah dan pembentukan nilai murid."
  },
  {
    id: "bm-b-detail",
    prompt: "Apakah kesan projek itu terhadap murid?",
    sentence: "Pilih butiran yang paling jelas dinyatakan dalam petikan.",
    passage: bmPassageSetB,
    options: [
      "Murid menjadi takut untuk ke sekolah.",
      "Murid belajar tentang tanggungjawab dan kerjasama.",
      "Murid berhenti menyertai semua aktiviti kokurikulum.",
      "Murid hanya datang untuk menyiram pokok pada hujung minggu."
    ],
    correctIndex: 1,
    explanation: "Petikan menyatakan secara langsung bahawa projek ini mengajar tanggungjawab dan kerjasama."
  },
  {
    id: "bm-b-inference",
    prompt: "Apakah inferens paling munasabah berdasarkan petikan?",
    sentence: "Pilih kesimpulan yang paling sesuai.",
    passage: bmPassageSetB,
    options: [
      "Projek itu mungkin akan diteruskan dan diperluas oleh pihak sekolah.",
      "Projek itu akan dihentikan kerana terlalu sedikit sambutan.",
      "Murid tidak berminat langsung terhadap aktiviti alam sekitar.",
      "Guru melarang murid lain daripada menyertai kebun mini."
    ],
    correctIndex: 0,
    explanation: "Sekolah merancang menambah lebih banyak tanaman herba, jadi projek itu berkemungkinan diteruskan dan diperluas."
  }
];

export const sejarahTimelineQuestions: ObjectiveQuestion[] = [
  {
    id: "sejarah-order-1",
    prompt: "Peristiwa manakah berlaku paling awal?",
    sentence: "Pilih peristiwa yang berlaku dahulu dalam sejarah Tanah Melayu.",
    options: [
      "Pembentukan Malaysia pada tahun 1963",
      "Kemerdekaan Persekutuan Tanah Melayu pada tahun 1957",
      "Pendudukan Jepun di Tanah Melayu pada tahun 1941",
      "Pilihan raya umum pertama selepas merdeka"
    ],
    correctIndex: 2,
    explanation: "Pendudukan Jepun bermula pada tahun 1941, lebih awal daripada kemerdekaan pada tahun 1957."
  },
  {
    id: "sejarah-order-2",
    prompt: "Apakah tujuan utama penubuhan Persekutuan Tanah Melayu 1948?",
    sentence: "Pilih jawapan yang paling tepat berdasarkan urutan perubahan politik selepas Malayan Union.",
    options: [
      "Untuk menggantikan semua sekolah vernakular dengan sekolah tunggal",
      "Untuk membentuk struktur pentadbiran baharu selepas penentangan terhadap Malayan Union",
      "Untuk menyertai Malaysia bersama Sabah dan Sarawak",
      "Untuk memulakan Darurat di Tanah Melayu"
    ],
    correctIndex: 1,
    explanation: "Persekutuan Tanah Melayu 1948 dibentuk selepas bantahan terhadap Malayan Union dan membawa struktur pentadbiran baharu."
  },
  {
    id: "sejarah-order-3",
    prompt: "Susunan manakah paling munasabah dari awal ke akhir?",
    sentence: "Pilih urutan sejarah yang betul.",
    options: [
      "Kemerdekaan 1957 -> Pendudukan Jepun 1941 -> Malaysia 1963",
      "Pendudukan Jepun 1941 -> Kemerdekaan 1957 -> Pembentukan Malaysia 1963",
      "Malaysia 1963 -> Malayan Union 1946 -> Kemerdekaan 1957",
      "Persekutuan Tanah Melayu 1948 -> Pendudukan Jepun 1941 -> Malaysia 1963"
    ],
    correctIndex: 1,
    explanation: "Urutan yang betul ialah pendudukan Jepun, kemudian kemerdekaan, dan seterusnya pembentukan Malaysia."
  }
];

export const sejarahTimelineQuestionsSetB: ObjectiveQuestion[] = [
  {
    id: "sejarah-order-b-1",
    prompt: "Peristiwa manakah berlaku selepas Malayan Union 1946?",
    sentence: "Pilih peristiwa yang berlaku selepas cadangan Malayan Union.",
    options: [
      "Penubuhan Persekutuan Tanah Melayu 1948",
      "Pendudukan Jepun 1941",
      "Pembentukan Malaysia 1963",
      "Penentangan terhadap Portugis di Melaka"
    ],
    correctIndex: 0,
    explanation: "Persekutuan Tanah Melayu 1948 dibentuk selepas Malayan Union 1946."
  },
  {
    id: "sejarah-order-b-2",
    prompt: "Yang manakah berlaku paling lewat?",
    sentence: "Pilih peristiwa yang berlaku paling akhir dalam urutan masa.",
    options: [
      "Darurat di Tanah Melayu",
      "Kemerdekaan Persekutuan Tanah Melayu",
      "Pembentukan Malaysia",
      "Pendudukan Jepun"
    ],
    correctIndex: 2,
    explanation: "Pembentukan Malaysia berlaku pada tahun 1963, lebih lewat daripada peristiwa lain yang diberi."
  },
  {
    id: "sejarah-order-b-3",
    prompt: "Apakah susunan yang paling tepat?",
    sentence: "Pilih urutan sejarah dari awal ke akhir.",
    options: [
      "Malayan Union -> Persekutuan Tanah Melayu -> Kemerdekaan",
      "Kemerdekaan -> Malayan Union -> Persekutuan Tanah Melayu",
      "Persekutuan Tanah Melayu -> Pendudukan Jepun -> Kemerdekaan",
      "Malaysia -> Kemerdekaan -> Malayan Union"
    ],
    correctIndex: 0,
    explanation: "Urutan yang tepat ialah Malayan Union 1946, Persekutuan Tanah Melayu 1948, kemudian kemerdekaan 1957."
  }
];

const sejarahSourcePassage =
  "Sumber A: Pada awal abad ke-20, sekolah Melayu di kampung memberi pendidikan asas seperti membaca, menulis, dan mengira. Namun begitu, peluang untuk melanjutkan pelajaran ke peringkat lebih tinggi masih terhad bagi kebanyakan penduduk tempatan. Keadaan ini mendorong sebahagian masyarakat tempatan menuntut peluang pendidikan yang lebih luas agar mereka dapat meningkatkan taraf hidup dan mengambil bahagian dalam pentadbiran.";

export const sejarahSourceQuestions: ObjectiveQuestion[] = [
  {
    id: "sejarah-source-1",
    prompt: "Apakah isu utama yang digambarkan dalam sumber ini?",
    sentence: "Pilih fokus utama yang paling tepat berdasarkan sumber.",
    passage: sejarahSourcePassage,
    options: [
      "Pendidikan asas sudah tidak diperlukan oleh masyarakat tempatan.",
      "Peluang pendidikan peringkat tinggi masih terhad kepada penduduk tempatan.",
      "Pentadbiran tempatan menolak semua bentuk pendidikan Melayu.",
      "Masyarakat tempatan hanya menuntut kemerdekaan penuh."
    ],
    correctIndex: 1,
    explanation: "Sumber menekankan bahawa walaupun pendidikan asas wujud, peluang ke peringkat lebih tinggi masih terhad."
  },
  {
    id: "sejarah-source-2",
    prompt: "Mengapakah masyarakat tempatan menuntut peluang pendidikan yang lebih luas?",
    sentence: "Pilih sebab yang paling jelas disokong oleh sumber.",
    passage: sejarahSourcePassage,
    options: [
      "Supaya mereka dapat meningkatkan taraf hidup dan terlibat dalam pentadbiran.",
      "Supaya semua sekolah kampung ditutup serta-merta.",
      "Supaya bahasa asing dihapuskan daripada semua sekolah.",
      "Supaya hanya golongan tertentu dibenarkan belajar."
    ],
    correctIndex: 0,
    explanation: "Sumber menyatakan secara terus bahawa pendidikan lebih luas diperlukan untuk meningkatkan taraf hidup dan penglibatan dalam pentadbiran."
  },
  {
    id: "sejarah-source-3",
    prompt: "Apakah inferens terbaik tentang kesan pendidikan pada zaman itu?",
    sentence: "Pilih kesimpulan yang paling munasabah daripada sumber.",
    passage: sejarahSourcePassage,
    options: [
      "Akses pendidikan yang terhad boleh mengehadkan kemajuan sosial masyarakat tempatan.",
      "Pendidikan asas tidak memberi sebarang manfaat kepada penduduk kampung.",
      "Semua penduduk tempatan menolak campur tangan pentadbiran.",
      "Isu pendidikan tidak berkait dengan peluang pekerjaan atau pentadbiran."
    ],
    correctIndex: 0,
    explanation: "Apabila peluang pendidikan tinggi terhad, masyarakat juga terhad dalam mobiliti sosial dan penglibatan pentadbiran."
  }
];

const sejarahSourcePassageSetB =
  "Sumber B: Beberapa akhbar tempatan pada zaman penjajahan melaporkan bahawa kesedaran politik dalam kalangan penduduk semakin meningkat. Penubuhan persatuan dan pertubuhan masyarakat menunjukkan rakyat mula memikirkan masa depan tanah air mereka. Dalam masa yang sama, pendidikan dan pendedahan kepada idea luar turut membantu membentuk keyakinan untuk menuntut perubahan.";

export const sejarahSourceQuestionsSetB: ObjectiveQuestion[] = [
  {
    id: "sejarah-source-b-1",
    prompt: "Apakah isu utama yang digambarkan dalam sumber ini?",
    sentence: "Pilih fokus utama yang paling tepat.",
    passage: sejarahSourcePassageSetB,
    options: [
      "Kesedaran politik rakyat semakin meningkat",
      "Akhbar tempatan dihentikan sepenuhnya",
      "Penduduk tidak berminat dengan masa depan tanah air",
      "Semua pertubuhan masyarakat dibubarkan"
    ],
    correctIndex: 0,
    explanation: "Sumber menekankan peningkatan kesedaran politik dalam kalangan penduduk tempatan."
  },
  {
    id: "sejarah-source-b-2",
    prompt: "Apakah faktor yang membantu membentuk keyakinan rakyat untuk menuntut perubahan?",
    sentence: "Pilih faktor yang disebut dalam sumber.",
    passage: sejarahSourcePassageSetB,
    options: [
      "Larangan pendidikan sepenuhnya",
      "Pendidikan dan pendedahan kepada idea luar",
      "Penghapusan semua persatuan",
      "Ketiadaan akhbar tempatan"
    ],
    correctIndex: 1,
    explanation: "Sumber menyatakan pendidikan dan pendedahan kepada idea luar membantu membina keyakinan rakyat."
  },
  {
    id: "sejarah-source-b-3",
    prompt: "Apakah inferens yang paling munasabah?",
    sentence: "Pilih kesimpulan terbaik berdasarkan sumber.",
    passage: sejarahSourcePassageSetB,
    options: [
      "Kesedaran politik boleh berkembang apabila rakyat lebih terdedah kepada organisasi dan pendidikan.",
      "Rakyat hanya bergantung kepada bantuan luar tanpa berfikir sendiri.",
      "Persatuan masyarakat tidak memberi sebarang kesan.",
      "Akhbar tempatan tidak memainkan peranan dalam masyarakat."
    ],
    correctIndex: 0,
    explanation: "Gabungan pendidikan, idea luar, dan pertubuhan masyarakat membantu meningkatkan kesedaran politik."
  }
];

const sejarahRevisionPassage =
  "Topik ringkas: Sistem Ahli diperkenalkan pada tahun 1951 sebagai langkah ke arah latihan pentadbiran sendiri di Tanah Melayu. Beberapa tokoh tempatan diberi tanggungjawab mengetuai portfolio tertentu seperti pendidikan, kesihatan, dan pertanian. Langkah ini penting kerana ia memberi pengalaman kepada pemimpin tempatan dalam urusan pentadbiran sebelum kemerdekaan dicapai.";

export const sejarahTopicRevisionQuestions: ObjectiveQuestion[] = [
  {
    id: "sejarah-revision-1",
    prompt: "Apakah tujuan utama Sistem Ahli diperkenalkan?",
    sentence: "Pilih jawapan yang paling tepat berdasarkan topik ringkas.",
    passage: sejarahRevisionPassage,
    options: [
      "Untuk menggantikan semua pentadbir British secara serta-merta",
      "Untuk memberi latihan pentadbiran kepada pemimpin tempatan",
      "Untuk menamatkan semua pilihan raya di Tanah Melayu",
      "Untuk menghapuskan semua portfolio kerajaan"
    ],
    correctIndex: 1,
    explanation: "Sistem Ahli diwujudkan sebagai latihan pentadbiran kepada pemimpin tempatan sebelum kemerdekaan."
  },
  {
    id: "sejarah-revision-2",
    prompt: "Apakah bukti bahawa Sistem Ahli membantu persediaan ke arah kemerdekaan?",
    sentence: "Pilih pernyataan yang paling menyokong idea itu.",
    passage: sejarahRevisionPassage,
    options: [
      "Pemimpin tempatan diberi pengalaman mengurus portfolio pentadbiran",
      "Semua keputusan politik dihentikan buat sementara waktu",
      "Tiada lagi penglibatan rakyat dalam pentadbiran",
      "Tanah Melayu terus dikuasai sepenuhnya tanpa perubahan"
    ],
    correctIndex: 0,
    explanation: "Pengalaman mengurus portfolio penting membantu pemimpin tempatan bersedia memimpin selepas kemerdekaan."
  },
  {
    id: "sejarah-revision-3",
    prompt: "Apakah inferens terbaik tentang kepentingan Sistem Ahli?",
    sentence: "Pilih kesimpulan yang paling munasabah.",
    passage: sejarahRevisionPassage,
    options: [
      "Ia tidak memberi sebarang kesan kepada proses politik Tanah Melayu.",
      "Ia menjadi satu langkah peralihan ke arah pemerintahan sendiri.",
      "Ia hanya melibatkan bidang pertanian sahaja.",
      "Ia diperkenalkan selepas Tanah Melayu mencapai kemerdekaan."
    ],
    correctIndex: 1,
    explanation: "Sistem Ahli merupakan langkah peralihan penting yang menyediakan pemimpin tempatan ke arah pemerintahan sendiri."
  }
];

const sejarahRevisionPassageSetB =
  "Topik ringkas: Jawatankuasa Hubungan Antara Kaum (CLC) ditubuhkan untuk membincangkan isu sensitif antara kaum di Tanah Melayu. Perbincangan ini penting untuk mewujudkan kerjasama politik dan sosial antara pemimpin masyarakat yang berbeza. Usaha tersebut membantu membina persefahaman yang lebih baik dalam menghadapi cabaran sebelum kemerdekaan.";

export const sejarahTopicRevisionQuestionsSetB: ObjectiveQuestion[] = [
  {
    id: "sejarah-revision-b-1",
    prompt: "Apakah tujuan utama CLC ditubuhkan?",
    sentence: "Pilih jawapan paling tepat berdasarkan topik ringkas.",
    passage: sejarahRevisionPassageSetB,
    options: [
      "Membincangkan isu antara kaum dan membina persefahaman",
      "Menggantikan semua sekolah di Tanah Melayu",
      "Menghapuskan kerjasama politik",
      "Menangguhkan kemerdekaan"
    ],
    correctIndex: 0,
    explanation: "CLC ditubuhkan untuk membincangkan isu antara kaum dan membantu membina persefahaman."
  },
  {
    id: "sejarah-revision-b-2",
    prompt: "Mengapakah usaha CLC penting sebelum kemerdekaan?",
    sentence: "Pilih sebab yang paling munasabah.",
    passage: sejarahRevisionPassageSetB,
    options: [
      "Kerana ia menghalang semua perbincangan politik",
      "Kerana ia membantu mewujudkan kerjasama antara pemimpin masyarakat",
      "Kerana ia hanya memberi manfaat kepada satu kaum",
      "Kerana ia tidak berkait dengan cabaran negara"
    ],
    correctIndex: 1,
    explanation: "CLC membantu mewujudkan kerjasama politik dan sosial antara pemimpin masyarakat berbeza."
  },
  {
    id: "sejarah-revision-b-3",
    prompt: "Apakah inferens terbaik tentang peranan CLC?",
    sentence: "Pilih kesimpulan paling sesuai.",
    passage: sejarahRevisionPassageSetB,
    options: [
      "CLC membantu menyediakan asas persefahaman untuk pembinaan negara",
      "CLC diwujudkan selepas semua masalah selesai",
      "CLC tidak memberi kesan kepada hubungan kaum",
      "CLC hanya memberi tumpuan kepada ekonomi luar negara"
    ],
    correctIndex: 0,
    explanation: "Perbincangan antara kaum membantu membina asas persefahaman bagi negara yang sedang menuju kemerdekaan."
  }
];

const geografiDataCard =
  "Data ringkas: Kawasan A menerima 2400 mm hujan setahun, Kawasan B menerima 1800 mm, dan Kawasan C menerima 900 mm. Kawasan A juga mempunyai litupan hutan yang paling luas berbanding dua kawasan lain.";

export const geografiMapDataQuestions: ObjectiveQuestion[] = [
  {
    id: "geo-data-1",
    prompt: "Kawasan manakah paling berpotensi mempunyai tumbuhan semula jadi yang lebih padat?",
    sentence: "Gunakan data hujan dan litupan hutan untuk memilih jawapan terbaik.",
    passage: geografiDataCard,
    options: ["Kawasan A", "Kawasan B", "Kawasan C", "Semua kawasan sama"],
    correctIndex: 0,
    explanation: "Kawasan A menerima hujan paling tinggi dan mempunyai litupan hutan paling luas, jadi tumbuhan semula jadinya lebih padat."
  },
  {
    id: "geo-data-2",
    prompt: "Apakah inferens paling munasabah tentang Kawasan C?",
    sentence: "Pilih kesimpulan terbaik berdasarkan jumlah hujan tahunan.",
    passage: geografiDataCard,
    options: [
      "Kawasan C mungkin mengalami keadaan yang lebih kering berbanding kawasan lain.",
      "Kawasan C menerima hujan paling banyak setiap tahun.",
      "Kawasan C mempunyai litupan hutan paling luas.",
      "Kawasan C tidak mempunyai sebarang aktiviti manusia."
    ],
    correctIndex: 0,
    explanation: "Jumlah hujan 900 mm menunjukkan Kawasan C lebih kering berbanding Kawasan A dan B."
  },
  {
    id: "geo-data-3",
    prompt: "Jika petani mahu tanaman yang memerlukan banyak air, kawasan manakah paling sesuai dipilih?",
    sentence: "Gunakan data hujan tahunan untuk menentukan pilihan terbaik.",
    passage: geografiDataCard,
    options: ["Kawasan A", "Kawasan B", "Kawasan C", "Tiada yang sesuai"],
    correctIndex: 0,
    explanation: "Kawasan A menerima 2400 mm hujan setahun, jadi ia paling sesuai untuk tanaman yang memerlukan banyak air."
  }
];

const geografiDataCardSetB =
  "Data ringkas: Bandar X mencatat suhu purata 33°C dengan litupan konkrit yang tinggi. Bandar Y mencatat 29°C dan mempunyai lebih banyak kawasan hijau. Bandar Z mencatat 27°C serta berada berhampiran kawasan tanah tinggi.";

export const geografiMapDataQuestionsSetB: ObjectiveQuestion[] = [
  {
    id: "geo-data-b-1",
    prompt: "Bandar manakah paling berisiko mengalami pulau haba bandar?",
    sentence: "Gunakan suhu dan litupan permukaan untuk memilih jawapan terbaik.",
    passage: geografiDataCardSetB,
    options: ["Bandar X", "Bandar Y", "Bandar Z", "Semua bandar sama"],
    correctIndex: 0,
    explanation: "Bandar X paling panas dan mempunyai litupan konkrit tinggi, jadi risikonya paling besar."
  },
  {
    id: "geo-data-b-2",
    prompt: "Mengapakah Bandar Y lebih sejuk berbanding Bandar X?",
    sentence: "Pilih inferens terbaik berdasarkan data.",
    passage: geografiDataCardSetB,
    options: [
      "Bandar Y mempunyai lebih banyak kawasan hijau",
      "Bandar Y tidak mempunyai penduduk",
      "Bandar Y lebih dekat dengan padang pasir",
      "Bandar Y menerima cahaya matahari lebih kuat"
    ],
    correctIndex: 0,
    explanation: "Kawasan hijau membantu menurunkan suhu persekitaran berbanding permukaan konkrit."
  },
  {
    id: "geo-data-b-3",
    prompt: "Apakah faktor yang mungkin membantu Bandar Z mencatat suhu paling rendah?",
    sentence: "Gunakan maklumat dalam data untuk membuat inferens.",
    passage: geografiDataCardSetB,
    options: [
      "Bandar Z berada berhampiran kawasan tanah tinggi",
      "Bandar Z mempunyai lebih banyak bangunan tinggi",
      "Bandar Z kurang angin sepanjang tahun",
      "Bandar Z tiada tumbuhan langsung"
    ],
    correctIndex: 0,
    explanation: "Kawasan tanah tinggi biasanya mempunyai suhu yang lebih rendah."
  }
];

const geografiConceptPassage =
  "Konsep: Hujan perolakan berlaku apabila permukaan bumi dipanaskan dengan kuat pada waktu tengah hari. Udara yang panas akan naik ke atas, lalu menyejuk dan memeluwap sebelum menghasilkan hujan lebat dalam tempoh yang singkat. Hujan jenis ini sering berlaku di kawasan tropika dan biasanya disertai guruh serta kilat.";

export const geografiConceptReviewQuestions: ObjectiveQuestion[] = [
  {
    id: "geo-concept-1",
    prompt: "Bilakah hujan perolakan paling kerap berlaku?",
    sentence: "Pilih masa yang paling sesuai berdasarkan konsep yang diberi.",
    passage: geografiConceptPassage,
    options: ["Awal pagi ketika suhu sangat rendah", "Tengah hari apabila permukaan bumi sangat panas", "Malam hari ketika langit cerah", "Sepanjang hari tanpa perubahan suhu"],
    correctIndex: 1,
    explanation: "Hujan perolakan berlaku apabila pemanasan kuat pada waktu tengah hari menyebabkan udara panas naik ke atas."
  },
  {
    id: "geo-concept-2",
    prompt: "Mengapakah udara panas naik ke atas dalam proses hujan perolakan?",
    sentence: "Pilih sebab yang paling tepat.",
    passage: geografiConceptPassage,
    options: [
      "Udara panas menjadi lebih tumpat daripada udara sekeliling.",
      "Udara panas lebih ringan lalu bergerak naik ke atmosfera.",
      "Udara panas sentiasa bergerak ke kawasan gunung sahaja.",
      "Udara panas ditolak turun oleh awan tebal."
    ],
    correctIndex: 1,
    explanation: "Udara panas kurang tumpat berbanding udara sejuk, jadi ia bergerak naik ke atas."
  },
  {
    id: "geo-concept-3",
    prompt: "Apakah ciri biasa hujan perolakan?",
    sentence: "Pilih ciri yang paling sesuai berdasarkan nota konsep.",
    passage: geografiConceptPassage,
    options: [
      "Hujan renyai yang berterusan sepanjang hari",
      "Hujan lebat singkat yang sering disertai guruh dan kilat",
      "Salji tebal di kawasan pergunungan",
      "Angin kering tanpa pembentukan awan"
    ],
    correctIndex: 1,
    explanation: "Hujan perolakan biasanya turun dengan lebat dalam tempoh singkat dan sering disertai guruh serta kilat."
  }
];

const geografiConceptPassageSetB =
  "Konsep: Hakisan tanih berlaku apabila lapisan atas tanah dibawa oleh air atau angin. Aktiviti seperti pembalakan tidak terkawal dan pertanian tanpa kawalan cerun boleh mempercepatkan proses ini. Kesan hakisan termasuk sungai menjadi cetek, banjir lumpur, dan penurunan kesuburan tanah.";

export const geografiConceptReviewQuestionsSetB: ObjectiveQuestion[] = [
  {
    id: "geo-concept-b-1",
    prompt: "Apakah yang dimaksudkan dengan hakisan tanih?",
    sentence: "Pilih definisi paling tepat berdasarkan nota konsep.",
    passage: geografiConceptPassageSetB,
    options: [
      "Pergerakan lapisan atas tanah oleh air atau angin",
      "Pembentukan bukit batu kapur",
      "Proses penyejukan udara panas",
      "Pemeluwapan wap air menjadi awan"
    ],
    correctIndex: 0,
    explanation: "Hakisan tanih berlaku apabila lapisan atas tanah dibawa oleh air atau angin."
  },
  {
    id: "geo-concept-b-2",
    prompt: "Aktiviti manakah boleh mempercepatkan hakisan tanih?",
    sentence: "Pilih aktiviti yang paling sesuai.",
    passage: geografiConceptPassageSetB,
    options: [
      "Pembalakan tidak terkawal",
      "Penanaman semula pokok",
      "Pemeliharaan teres cerun",
      "Pembinaan longkang tersusun"
    ],
    correctIndex: 0,
    explanation: "Pembalakan tidak terkawal mendedahkan tanah dan mempercepatkan hakisan."
  },
  {
    id: "geo-concept-b-3",
    prompt: "Apakah salah satu kesan hakisan tanih?",
    sentence: "Pilih kesan yang dinyatakan dalam konsep.",
    passage: geografiConceptPassageSetB,
    options: [
      "Sungai menjadi cetek",
      "Suhu bandar sentiasa menurun",
      "Pembentukan salji tebal",
      "Kualiti udara bertambah baik secara automatik"
    ],
    correctIndex: 0,
    explanation: "Hakisan boleh menyebabkan sungai menjadi cetek akibat mendapan tanah."
  }
];

export const geografiShortAnswerPrompt = {
  id: "geo-short-a",
  label: "Set A",
  title: "Short Answer Practice",
  prompt:
    "Terangkan dua kesan pembalakan tidak terkawal terhadap alam sekitar dan cadangkan satu langkah mengurangkannya.",
  helper: "Tulis jawapan ringkas berformat exam style dengan isi yang jelas dan cadangan yang munasabah.",
  guidance:
    "Sasarkan sekurang-kurangnya dua kesan, satu langkah penyelesaian, dan gunakan kata hubung seperti 'selain itu', 'oleh itu', atau 'contohnya'."
};

export const writingCoachPromptSetB: WritingPrompt = {
  id: "writing-b",
  label: "Set B",
  title: "Writing Coach",
  prompt: "Write a short response explaining one habit that helps students stay consistent with revision.",
  helper: "Build a clear idea, support it with one example, and end with a practical takeaway.",
  guidance:
    "Aim for at least 3 complete sentences. Try to use linking words such as 'because', 'however', or 'for example'."
};

export const karanganCoachPromptSetB: WritingPrompt = {
  id: "karangan-b",
  label: "Set B",
  title: "Karangan Coach",
  prompt: "Huraikan satu cara murid boleh mengurus masa dengan baik semasa minggu peperiksaan.",
  helper: "Tulis satu perenggan yang ada isi utama, huraian ringkas, dan satu contoh.",
  guidance:
    "Gunakan sekurang-kurangnya 3 ayat lengkap dan cuba masukkan penanda wacana seperti 'oleh itu' atau 'contohnya'."
};

export const geografiShortAnswerPromptSetB: WritingPrompt = {
  id: "geo-short-b",
  label: "Set B",
  title: "Short Answer Practice",
  prompt:
    "Jelaskan dua kesan banjir kilat di kawasan bandar dan cadangkan satu langkah yang boleh diambil oleh pihak berkuasa tempatan.",
  helper: "Tulis jawapan berstruktur dengan dua kesan yang jelas dan satu cadangan yang praktikal.",
  guidance:
    "Gunakan istilah seperti saliran, pencemaran, keselamatan, atau infrastruktur jika sesuai, dan pastikan jawapan anda tersusun."
};

export const mathTopicPracticeQuestions: ObjectiveQuestion[] = [
  {
    id: "math-fraction",
    prompt: "What is the value of 3/4 + 1/8?",
    sentence: "Choose the correct fraction answer.",
    options: ["4/12", "7/8", "1", "5/8"],
    correctIndex: 1,
    explanation: "Convert 3/4 to 6/8, then add 1/8 to get 7/8."
  },
  {
    id: "math-linear",
    prompt: "Solve the equation 2x + 5 = 17.",
    sentence: "Find the correct value of x.",
    options: ["4", "5", "6", "7"],
    correctIndex: 2,
    explanation: "Subtract 5 from both sides to get 2x = 12, then divide by 2 to get x = 6."
  },
  {
    id: "math-perimeter",
    prompt: "A rectangle has length 9 cm and width 4 cm. What is its perimeter?",
    sentence: "Choose the correct perimeter.",
    options: ["13 cm", "18 cm", "26 cm", "36 cm"],
    correctIndex: 2,
    explanation: "Perimeter of a rectangle is 2(length + width), so 2(9 + 4) = 26 cm."
  }
];

export const mathTopicPracticeQuestionsSetB: ObjectiveQuestion[] = [
  {
    id: "math-b-ratio",
    prompt: "A class has 12 boys and 18 girls. What is the ratio of boys to girls in simplest form?",
    sentence: "Choose the simplified ratio.",
    options: ["12:18", "3:2", "2:3", "6:9"],
    correctIndex: 2,
    explanation: "Divide both 12 and 18 by 6 to get 2:3."
  },
  {
    id: "math-b-area",
    prompt: "What is the area of a triangle with base 10 cm and height 6 cm?",
    sentence: "Use the correct formula for triangle area.",
    options: ["60 cm²", "30 cm²", "16 cm²", "20 cm²"],
    correctIndex: 1,
    explanation: "Area of a triangle is 1/2 × base × height = 1/2 × 10 × 6 = 30 cm²."
  },
  {
    id: "math-b-percentage",
    prompt: "Find 25% of 240.",
    sentence: "Choose the correct value.",
    options: ["40", "50", "60", "80"],
    correctIndex: 2,
    explanation: "25% is one quarter, and one quarter of 240 is 60."
  }
];

export const addMathStepCheckQuestions: ObjectiveQuestion[] = [
  {
    id: "addmath-expand",
    prompt: "Expand and simplify (x + 3)(x - 2).",
    sentence: "Choose the algebraic expression with the correct middle term and constant.",
    options: ["x^2 + x - 6", "x^2 - x - 6", "x^2 + 6x - 6", "x^2 - 6"],
    correctIndex: 0,
    explanation: "Expand carefully: x(x - 2) + 3(x - 2) = x^2 - 2x + 3x - 6 = x^2 + x - 6."
  },
  {
    id: "addmath-solve-quadratic",
    prompt: "Solve x^2 - 5x + 6 = 0.",
    sentence: "Pick the correct pair of roots.",
    options: ["x = 1 or x = 6", "x = 2 or x = 3", "x = -2 or x = -3", "x = 5 or x = 6"],
    correctIndex: 1,
    explanation: "Factor the quadratic as (x - 2)(x - 3) = 0, so the roots are 2 and 3."
  },
  {
    id: "addmath-gradient",
    prompt: "Find the gradient of the line joining (2, 5) and (6, 13).",
    sentence: "Check the change in y over the change in x.",
    options: ["1", "2", "3", "4"],
    correctIndex: 1,
    explanation: "Use (13 - 5) / (6 - 2) = 8 / 4 = 2."
  }
];

export const addMathStepCheckQuestionsSetB: ObjectiveQuestion[] = [
  {
    id: "addmath-b-factorise",
    prompt: "Factorise x² + 7x + 12.",
    sentence: "Choose the correct factorised form.",
    options: ["(x + 3)(x + 4)", "(x - 3)(x - 4)", "(x + 2)(x + 6)", "(x - 2)(x - 6)"],
    correctIndex: 0,
    explanation: "You need two numbers that add to 7 and multiply to 12: 3 and 4."
  },
  {
    id: "addmath-b-index",
    prompt: "Simplify a^3 × a^5.",
    sentence: "Apply the law of indices.",
    options: ["a^8", "a^15", "a^2", "2a^8"],
    correctIndex: 0,
    explanation: "When multiplying the same base, add the powers: 3 + 5 = 8."
  },
  {
    id: "addmath-b-line",
    prompt: "Find the equation of a line with gradient 3 and y-intercept 2.",
    sentence: "Choose the correct equation.",
    options: ["y = 2x + 3", "y = 3x + 2", "y = 3x - 2", "y = x + 5"],
    correctIndex: 1,
    explanation: "In the form y = mx + c, m = 3 and c = 2, so y = 3x + 2."
  }
];

const workedSolutionPassage =
  "A student solves 3(x + 4) = 24 like this: Step 1: 3x + 4 = 24. Step 2: 3x = 20. Step 3: x = 20/3. The final answer is wrong because the expansion step was not done carefully.";

export const workedSolutionReviewQuestions: ObjectiveQuestion[] = [
  {
    id: "math-worked-1",
    prompt: "Which step contains the first mistake?",
    sentence: "Read the worked solution and choose the earliest incorrect step.",
    passage: workedSolutionPassage,
    options: ["Step 1", "Step 2", "Step 3", "There is no mistake"],
    correctIndex: 0,
    explanation: "3(x + 4) should expand to 3x + 12, not 3x + 4, so the first error happens in Step 1."
  },
  {
    id: "math-worked-2",
    prompt: "What should Step 1 be after expanding the bracket correctly?",
    sentence: "Pick the corrected algebraic statement.",
    passage: workedSolutionPassage,
    options: ["3x + 4 = 24", "3x + 12 = 24", "x + 12 = 24", "3x = 24"],
    correctIndex: 1,
    explanation: "Multiplying 3 by both x and 4 gives 3x + 12 = 24."
  },
  {
    id: "math-worked-3",
    prompt: "What is the correct value of x?",
    sentence: "Continue the corrected working to find the answer.",
    options: ["2", "3", "4", "6"],
    correctIndex: 2,
    explanation: "From 3x + 12 = 24, subtract 12 to get 3x = 12, then divide by 3 to get x = 4."
  }
];

const workedSolutionPassageSetB =
  "A student finds the area of a triangle with base 8 cm and height 5 cm like this: Step 1: 8 × 5 = 40. Step 2: Area = 40 cm². The final answer is wrong because one key step is missing.";

export const workedSolutionReviewQuestionsSetB: ObjectiveQuestion[] = [
  {
    id: "math-worked-b-1",
    prompt: "What is the missing step in this solution?",
    sentence: "Choose the correction needed.",
    passage: workedSolutionPassageSetB,
    options: [
      "Add 8 and 5 first",
      "Multiply by 2 again",
      "Divide by 2 after multiplying base and height",
      "Change the unit to metres"
    ],
    correctIndex: 2,
    explanation: "The triangle area formula requires dividing by 2 after multiplying base and height."
  },
  {
    id: "math-worked-b-2",
    prompt: "What is the correct area?",
    sentence: "Continue the corrected working.",
    passage: workedSolutionPassageSetB,
    options: ["20 cm²", "40 cm²", "13 cm²", "10 cm²"],
    correctIndex: 0,
    explanation: "1/2 × 8 × 5 = 20 cm²."
  },
  {
    id: "math-worked-b-3",
    prompt: "What type of mistake is this?",
    sentence: "Choose the best description of the error.",
    passage: workedSolutionPassageSetB,
    options: [
      "A formula step was skipped",
      "A spelling error only",
      "A graph plotting error",
      "A fraction simplification issue"
    ],
    correctIndex: 0,
    explanation: "The student used part of the formula but skipped the division by 2 step."
  }
];

const errorPatternPassage =
  "Error log: Amir keeps making three mistakes in his Math revision. Mistake 1: He adds fractions without finding a common denominator. Mistake 2: He forgets to multiply both brackets when expanding expressions. Mistake 3: He uses the wrong formula when finding the area of a triangle.";

export const errorPatternTrackerQuestions: ObjectiveQuestion[] = [
  {
    id: "math-error-1",
    prompt: "Which mistake should Amir fix first if he wants to improve fraction questions?",
    sentence: "Choose the most direct revision target from the error log.",
    passage: errorPatternPassage,
    options: [
      "Learn to find a common denominator before adding fractions",
      "Memorise the perimeter formula for rectangles",
      "Practise drawing bar charts",
      "Review compass directions"
    ],
    correctIndex: 0,
    explanation: "The fraction mistake is specifically about adding without a common denominator, so that is the most direct fix."
  },
  {
    id: "math-error-2",
    prompt: "What pattern is shown by the bracket-expansion mistake?",
    sentence: "Pick the most accurate description of the error type.",
    passage: errorPatternPassage,
    options: [
      "A reading comprehension mistake",
      "A method error in algebraic expansion",
      "A geometry drawing error",
      "A calculator battery problem"
    ],
    correctIndex: 1,
    explanation: "Forgetting to multiply both terms in brackets is a method error in algebra expansion."
  },
  {
    id: "math-error-3",
    prompt: "Which revision move is most sensible based on the full error log?",
    sentence: "Choose the best next-step plan.",
    passage: errorPatternPassage,
    options: [
      "Repeat random questions without checking mistakes",
      "Focus on one error pattern at a time and review the related formula or method",
      "Skip all fraction and algebra questions for now",
      "Only revise topics that already feel easy"
    ],
    correctIndex: 1,
    explanation: "The log shows repeated method mistakes, so the best response is targeted review by error pattern."
  }
];

const errorPatternPassageSetB =
  "Error log: Sara keeps making three mistakes. Mistake 1: She solves equations but forgets to reverse the sign when moving terms across. Mistake 2: She reads percentages as whole numbers. Mistake 3: She copies the wrong number from the question into her working.";

export const errorPatternTrackerQuestionsSetB: ObjectiveQuestion[] = [
  {
    id: "math-error-b-1",
    prompt: "Which mistake is a sign-handling problem?",
    sentence: "Choose the error pattern most directly linked to sign changes.",
    passage: errorPatternPassageSetB,
    options: [
      "Reading percentages as whole numbers",
      "Forgetting to reverse the sign when moving terms",
      "Copying the wrong number from the question",
      "Drawing the table too slowly"
    ],
    correctIndex: 1,
    explanation: "This is the error pattern specifically related to sign handling in equations."
  },
  {
    id: "math-error-b-2",
    prompt: "What is the smartest revision move for the percentage mistake?",
    sentence: "Choose the best targeted fix.",
    passage: errorPatternPassageSetB,
    options: [
      "Avoid all percentage questions",
      "Practise converting percentages into fractions or decimals before solving",
      "Only do geometry revision",
      "Skip checking answers"
    ],
    correctIndex: 1,
    explanation: "The best fix is targeted practice converting percentages correctly."
  },
  {
    id: "math-error-b-3",
    prompt: "What wider lesson does the error log suggest?",
    sentence: "Choose the best general conclusion.",
    passage: errorPatternPassageSetB,
    options: [
      "Sara needs targeted checking habits, not just more random practice",
      "Sara should stop revising equations entirely",
      "Mistake logs are not useful for revision",
      "Every error can be ignored if the final answer looks close"
    ],
    correctIndex: 0,
    explanation: "The log shows repeated process mistakes, so targeted checking habits are needed."
  }
];

const readingPassage =
  "A small school library started a lunchtime reading circle for students who felt nervous about speaking in class. At first, only six students joined. After a month, the group grew because members began recommending books to one another and sharing short reflections. Teachers noticed that some students who rarely answered questions in class were starting to explain their ideas with more confidence. The library then added a weekly 'book talk' session, where each student gave a one-minute recommendation about a story they had enjoyed.";

export const readingDecoderQuestions: ObjectiveQuestion[] = [
  {
    id: "main-idea",
    prompt: "What is the main idea of the passage?",
    sentence: "Choose the best summary of the full passage.",
    passage: readingPassage,
    options: [
      "The library had to close because students stopped reading books.",
      "A reading circle helped students build confidence and participate more actively.",
      "Teachers replaced classroom discussions with book talks every day.",
      "Only top students were invited to join the reading circle."
    ],
    correctIndex: 1,
    explanation: "The passage focuses on how the reading circle increased confidence and classroom participation."
  },
  {
    id: "detail",
    prompt: "Which detail best shows that the reading circle was successful?",
    sentence: "Pick the strongest supporting evidence from the passage.",
    passage: readingPassage,
    options: [
      "The school library bought new chairs.",
      "Students started borrowing fewer books each week.",
      "Teachers noticed quieter students explaining ideas with more confidence.",
      "The reading circle only met once a month."
    ],
    correctIndex: 2,
    explanation: "This detail directly shows a positive change in student confidence and participation."
  },
  {
    id: "inference",
    prompt: "What can we infer about the book talk session?",
    sentence: "Choose the most reasonable inference based on the passage.",
    passage: readingPassage,
    options: [
      "It was added to help students practise expressing opinions briefly.",
      "It replaced the reading circle completely.",
      "It was only meant for teachers, not students.",
      "It made students less interested in reading."
    ],
    correctIndex: 0,
    explanation: "The one-minute recommendation format suggests the session was designed to build concise speaking confidence."
  }
];

const readingPassageSetB =
  "A group of students started a peer tutoring corner after school to help classmates with homework and revision. At first, only a few students joined, but the number increased after teachers noticed that the sessions were friendly and low-pressure. Students who attended regularly said they felt more comfortable asking questions there than during class time. As the tutoring corner became more popular, the school added a weekly timetable so students could choose which subject support they needed.";

export const readingDecoderQuestionsSetB: ObjectiveQuestion[] = [
  {
    id: "reading-b-main",
    prompt: "What is the main idea of the passage?",
    sentence: "Choose the best summary of the passage.",
    passage: readingPassageSetB,
    options: [
      "Students avoided asking for help after school.",
      "A peer tutoring corner helped students get support in a more comfortable setting.",
      "Teachers replaced classroom teaching with peer tutoring.",
      "Only top students were allowed to attend the tutoring corner."
    ],
    correctIndex: 1,
    explanation: "The passage focuses on how peer tutoring gave students a more comfortable way to seek support."
  },
  {
    id: "reading-b-detail",
    prompt: "Which detail best shows why the tutoring corner became popular?",
    sentence: "Choose the strongest supporting detail.",
    passage: readingPassageSetB,
    options: [
      "Students felt more comfortable asking questions there than during class time.",
      "The school painted the room a new colour.",
      "The sessions lasted exactly ten minutes each day.",
      "Only science subjects were offered there."
    ],
    correctIndex: 0,
    explanation: "This detail directly explains why students valued the tutoring corner."
  },
  {
    id: "reading-b-inference",
    prompt: "What can be inferred about the school from the final sentence?",
    sentence: "Choose the best inference.",
    passage: readingPassageSetB,
    options: [
      "The school plans to support the tutoring corner more formally.",
      "The tutoring corner will be closed soon.",
      "Students are no longer interested in tutoring.",
      "Teachers do not know which subjects students need."
    ],
    correctIndex: 0,
    explanation: "Adding a weekly timetable suggests the school is supporting and organizing the tutoring corner more formally."
  }
];

export const objectiveQuestionPools: Record<string, ObjectiveQuestionSet[]> = {
  "english:grammar-lab": [
    { id: "grammar-set-a", label: "Set A", questions: grammarLabQuestions },
    { id: "grammar-set-b", label: "Set B", questions: grammarLabQuestionsSetB }
  ],
  "bahasa_melayu:tatabahasa": [
    { id: "tatabahasa-set-a", label: "Set A", questions: tatabahasaQuestions },
    { id: "tatabahasa-set-b", label: "Set B", questions: tatabahasaQuestionsSetB }
  ],
  "bahasa_melayu:pemahaman-drill": [
    { id: "pemahaman-set-a", label: "Set A", questions: pemahamanQuestions },
    { id: "pemahaman-set-b", label: "Set B", questions: pemahamanQuestionsSetB }
  ],
  "english:reading-decoder": [
    { id: "reading-set-a", label: "Set A", questions: readingDecoderQuestions },
    { id: "reading-set-b", label: "Set B", questions: readingDecoderQuestionsSetB }
  ],
  "sejarah:timeline-recall": [
    { id: "sejarah-timeline-set-a", label: "Set A", questions: sejarahTimelineQuestions },
    { id: "sejarah-timeline-set-b", label: "Set B", questions: sejarahTimelineQuestionsSetB }
  ],
  "sejarah:source-question-drill": [
    { id: "sejarah-source-set-a", label: "Set A", questions: sejarahSourceQuestions },
    { id: "sejarah-source-set-b", label: "Set B", questions: sejarahSourceQuestionsSetB }
  ],
  "sejarah:topic-revision-set": [
    { id: "sejarah-revision-set-a", label: "Set A", questions: sejarahTopicRevisionQuestions },
    { id: "sejarah-revision-set-b", label: "Set B", questions: sejarahTopicRevisionQuestionsSetB }
  ],
  "geografi:map-and-data-drill": [
    { id: "geografi-data-set-a", label: "Set A", questions: geografiMapDataQuestions },
    { id: "geografi-data-set-b", label: "Set B", questions: geografiMapDataQuestionsSetB }
  ],
  "geografi:concept-review": [
    { id: "geografi-concept-set-a", label: "Set A", questions: geografiConceptReviewQuestions },
    { id: "geografi-concept-set-b", label: "Set B", questions: geografiConceptReviewQuestionsSetB }
  ],
  "math:topic-practice": [
    { id: "math-topic-set-a", label: "Set A", questions: mathTopicPracticeQuestions },
    { id: "math-topic-set-b", label: "Set B", questions: mathTopicPracticeQuestionsSetB }
  ],
  "math:worked-solution-review": [
    { id: "math-worked-set-a", label: "Set A", questions: workedSolutionReviewQuestions },
    { id: "math-worked-set-b", label: "Set B", questions: workedSolutionReviewQuestionsSetB }
  ],
  "math:error-pattern-tracker": [
    { id: "math-error-set-a", label: "Set A", questions: errorPatternTrackerQuestions },
    { id: "math-error-set-b", label: "Set B", questions: errorPatternTrackerQuestionsSetB }
  ],
  "add_math:step-check-drill": [
    { id: "addmath-set-a", label: "Set A", questions: addMathStepCheckQuestions },
    { id: "addmath-set-b", label: "Set B", questions: addMathStepCheckQuestionsSetB }
  ]
};

export function getObjectiveQuestionSet(subjectCode: string, moduleSlug: string, referenceDate = new Date()) {
  const key = `${subjectCode}:${moduleSlug}`;
  const pool = objectiveQuestionPools[key];
  if (!pool?.length) {
    return null;
  }

  const startOfYear = new Date(Date.UTC(referenceDate.getUTCFullYear(), 0, 1));
  const today = new Date(Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), referenceDate.getUTCDate()));
  const dayIndex = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

  return pool[dayIndex % pool.length];
}

export const writingCoachPrompt: WritingPrompt = {
  id: "writing-a",
  label: "Set A",
  title: "Writing Coach Mini Prompt",
  helper: "Draft one short paragraph with a clear opinion and one supporting reason.",
  prompt: "Your school wants to start a weekly reading challenge. Write a short paragraph explaining why students should join.",
  guidance: "Aim for 40 to 90 words. State one clear opinion, give one reason, and use at least one linking phrase."
};

export const karanganCoachPrompt: WritingPrompt = {
  id: "karangan-a",
  label: "Set A",
  title: "Karangan Coach Mini Prompt",
  helper: "Tulis satu perenggan ringkas dengan pendapat yang jelas dan satu sebab yang kukuh.",
  prompt: "Sekolah anda ingin menjalankan Hari Membaca setiap minggu. Tulis satu perenggan tentang mengapa murid patut menyertainya.",
  guidance:
    "Sasarkan 45 hingga 100 patah perkataan. Nyatakan pendapat anda, beri satu sebab, dan gunakan sekurang-kurangnya satu penanda wacana."
};

const writingPromptPools: Record<string, WritingPrompt[]> = {
  "english:writing-coach": [writingCoachPrompt, writingCoachPromptSetB],
  "bahasa_melayu:karangan-coach": [karanganCoachPrompt, karanganCoachPromptSetB],
  "geografi:short-answer-practice": [geografiShortAnswerPrompt, geografiShortAnswerPromptSetB]
};

export function getRotatingWritingPrompt(subjectCode: string, moduleSlug: string, referenceDate = new Date()) {
  const key = `${subjectCode}:${moduleSlug}`;
  const pool = writingPromptPools[key];
  if (!pool?.length) {
    return null;
  }

  const startOfYear = new Date(Date.UTC(referenceDate.getUTCFullYear(), 0, 1));
  const today = new Date(Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), referenceDate.getUTCDate()));
  const dayIndex = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

  return pool[dayIndex % pool.length];
}

export const vocabularyBuilderSet = {
  title: "Vocabulary Builder Mini Set",
  helper: "Review 3 useful words, then choose the best fit in short contexts.",
  words: [
    {
      term: "confident",
      meaning: "feeling sure about your ability to do something well",
      tip: "Use it when describing someone who speaks or acts without too much fear."
    },
    {
      term: "encourage",
      meaning: "to give support so someone feels more willing to try",
      tip: "Often followed by a person or group receiving support."
    },
    {
      term: "improve",
      meaning: "to become better or make something better",
      tip: "Useful when writing about progress in study habits or skills."
    }
  ],
  questions: [
    {
      id: "confident-use",
      prompt: "Choose the best word to complete the sentence.",
      sentence: "After a month in the reading club, Hana felt more ____ when sharing ideas.",
      options: ["confident", "encourage", "improve", "confidence"],
      correctIndex: 0,
      explanation: "'Confident' is the adjective that correctly describes Hana's feeling."
    },
    {
      id: "encourage-use",
      prompt: "Choose the strongest word choice.",
      sentence: "Teachers should ____ students to explain their answers clearly.",
      options: ["improve", "encourage", "confidence", "confident"],
      correctIndex: 1,
      explanation: "'Encourage' is the verb that means giving support so students will try."
    },
    {
      id: "improve-use",
      prompt: "Choose the most accurate completion.",
      sentence: "Reading every day can ____ a student's vocabulary and writing ideas.",
      options: ["encourage", "confidence", "improve", "confident"],
      correctIndex: 2,
      explanation: "'Improve' fits because the sentence is about making skills better."
    }
  ] satisfies {
    id: string;
    prompt: string;
    sentence: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[]
};
