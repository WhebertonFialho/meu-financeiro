export function formatarData(dataStr: string): string {
    const partes = dataStr.split('/').map(Number);
    const dia = partes[0];
    const mes = (partes[1] || 1) - 1; 
    const ano = partes[2] || 2000;

    const data = new Date(ano, mes, dia);

    const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    };

    const dataFormatada = data.toLocaleDateString('pt-BR', options);

    return dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
}

export function parseDDMMYYYYtoDate(dataStr: string): Date {
    const partes = dataStr.split('/').map(Number);
    const dia = partes[0];
    const mes = (partes[1] || 1) - 1; 
    const ano = partes[2] || 2000;

    return new Date(ano, mes, dia);
}

export function parseDateToDDMMYYYY(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

export const parseNumber = (digits: string | number): string => {
  if (digits === undefined || digits === null || digits === '') 
    return '0,00';

  const cleanDigits = digits.toString().replace(/\D/g, '');
  
  if (!cleanDigits) 
    return '0,00';

  const number = parseInt(cleanDigits, 10) / 100;
  
  return number.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const gerarCores = (quantidade: number): string[] => {
  const cores: string[] = [];
  if (quantidade <= 0) return [];
  
  const passo = 360 / quantidade; 

  for (let i = 0; i < quantidade; i++) {
    const hue = (60 + (i * passo)) % 360;  
    const saturation = 35; 
    const lightness = 70; 

    cores.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return cores.sort(() => Math.random() - 0.5);
};