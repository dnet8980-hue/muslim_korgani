// 1. Аудио үшін жаһандық айнымалы (кез келген жерден тоқтату үшін)
let currentAudio = new Audio();

// 2. Сүрені және аудионы жүктеу функциясы
async function loadSura(id, name) {
    const contentDiv = document.getElementById('suraContent');
    const display = document.getElementById('suraDisplay');
    const title = document.getElementById('suraTitle');
    
    // Интерфейсті дайындау
    title.innerText = "Жүктелуде...";
    contentDiv.innerHTML = "<p style='text-align:center'>Мәтін мен аудио дайындалып жатыр...</p>";
    display.style.display = "block";
    quranMenu.style.display = "none";

    try {
        // API-ден мәтін мен аудионы қатар алу (Мишари Рашид дауысы)
        const [textRes, audioRes] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/surah/${id}`),
            fetch(`https://api.alquran.cloud/v1/surah/${id}/ar.alafasy`)
        ]);

        const textData = await textRes.json();
        const audioData = await audioRes.json();
        
        title.innerText = `${id}. ${name}`;
        contentDiv.innerHTML = ""; // Күту мәтінін тазалау

        // Әр аятты циклмен шығару
        textData.data.ayahs.forEach((ayah, index) => {
            const audioUrl = audioData.data.ayahs[index].audio;
            const ayahCard = document.createElement('div');
            
            ayahCard.style.cssText = `
                margin-bottom: 20px; 
                padding: 15px; 
                background: #f9f9f9; 
                border-radius: 10px; 
                border-right: 4px solid var(--gold);
            `;
            
            ayahCard.innerHTML = `
                <span class="arabic" style="font-size: 26px; line-height: 1.8; color: #1b4332;">
                    ${ayah.text}
                </span>
                <div style="display: flex; align-items: center; gap: 15px; margin-top: 10px;">
                    <button onclick="playVoice('${audioUrl}')" 
                            style="background: var(--primary); color: white; border: none; 
                                   border-radius: 50%; width: 40px; height: 40px; cursor: pointer; 
                                   box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                        ▶️
                    </button>
                    <small style="color: #666; font-weight: bold;">[${id}:${ayah.numberInSurah}]</small>
                </div>
            `;
            contentDiv.appendChild(ayahCard);
        });
    } catch (error) {
        contentDiv.innerHTML = "<p style='color:red'>Қате: Интернет байланысын тексеріңіз.</p>";
    }
}

// 3. Аудионы ойнату функциясы
function playVoice(url) {
    currentAudio.pause(); // Ескі аудионы тоқтату
    currentAudio = new Audio(url);
    currentAudio.play().catch(e => console.error("Аудио қосылмады:", e));
}

// 4. Сүрені жабу және аудионы тоқтату
function closeSura() {
    currentAudio.pause(); // Дыбысты өшіру
    document.getElementById('suraDisplay').style.display = "none";
    document.getElementById('quranSuraMenu').style.display = "grid";
}