const FUNCTION_URL = 'https://your-function-url.azurewebsites.net/api/Counter';

async function updateVisitorCount() {
    try{
        const response = await fetch(FUNCTION_URL, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('HTTP error! status: ${response.status}');
        }

        const data = await response.json();
        const countElement = document.getElementById('visitor-count');

        if (countElement){
            countElement.textContent = data.count;
        }
    } catch (error) {
        console.error('Error updating visitor count:', error);

        const countElement = document.getElementById('visitor-count');
        if (countElement){
            countElement.textContent = '-';
        }
    }
}

document.addEventListener('DOMContentLoaded', ()=>{updateVisitorCount();});