import styles from '../styles/info.module.css';

const Information = () => {
  return (
    <div className={styles['home-container']}>
      <h2>Tasly <span className={styles['version']}>v1.0.0</span></h2>
      <div className={styles['info-section']}>
        <h2>¿Qué es Tasly? </h2>
        <p>
        Tasly es una aplicación web diseñada para ayudar a las personas a llevar un control intuitivo de sus tareas diarias y semanales.<br /><br />

        La idea surgió un día en el que me di cuenta de que no tenía un control adecuado de mis tareas. No quería depender de una aplicación de terceros, 
        así que decidí crear la mía, ajustándola exactamente a mis necesidades y a cómo yo quería que funcionara. A medida que avanzaba en el desarrollo, 
        se me ocurrían nuevas funcionalidades que podía integrar, y así fue evolucionando.<br /><br />

        Pero Tasly no es solo una app de tareas. También pensé en agregar frases inspiradoras, esas que puedas compartir con otros usuarios, aunque esto es 
        una idea para el futuro, ya que aún no tengo un plan definido para implementarlo. Además, incorporé un sistema de metas, donde el enfoque está en 
        permitir trazar objetivos a largo plazo (mínimo tres meses) y registrar el progreso cada vez que sientas que has avanzado.<br /><br />

        <strong><span style={{ fontSize: "1.3em", marginTop: "10px", display: "block"  }}>¿Cómo funciona?</span></strong> <br />
        El acceso a la aplicación es sencillo y seguro. No necesitas ingresar correos ni datos personales adicionales. Aquí tu privacidad es prioridad. Solo 
        crea un usuario, genera una contraseña sencilla pero segura, y empieza a gestionar tus tareas, metas y frases favoritas, ya sean de tu autor preferido 
        o pensamientos que hayas escrito en algún momento de tu vida.<br /><br />

        Las validaciones son gestionadas directamente por el servidor para evitar vulnerabilidades en los campos de ingreso. Siéntete libre de crear y organizar 
        tus tareas y metas como mejor te funcione.<br /><br />

        Cada mes, el servidor archivará automáticamente las tareas que superen los 30 días de antigüedad. Pero no te preocupes, nada se pierde. La barra de búsqueda 
        te permitirá encontrar cualquier tarea sin importar si es de hace un mes, un día o incluso un año.<br /><br />

        Como esta es la primera versión del proyecto, se irán registrando ajustes conforme se detecten errores o mejoras en la lógica. Para el desarrollo, he utilizado tecnologías como:<br />
        <strong>Cliente:</strong> TypeScript, React, CSS<br />
        <strong>Servidor:</strong> Node.js, Express, PostgreSQL<br /><br />

        Tus sugerencias son bienvenidas. Si encuentras algo que no encaje contigo o crees que se puede mejorar, házmelo saber. Este proyecto está en constante evolución y tú también 
        puedes ser parte de su crecimiento...💡<br /><br />

        <em>"La vida es como andar en bicicleta. Para mantener el equilibrio, debes seguir avanzando." - Albert Einstein</em></p>

        <div className={styles['contact']}>
          <h3>Contacto</h3>
          <p>Email: ramirodjaltor2016@gmail.com</p>
          <p>Teléfono: +57 300 235 3297</p>
        </div>
      </div>
    </div>
  );
};

export default Information;
