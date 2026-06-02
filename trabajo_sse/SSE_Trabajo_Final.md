# Análisis de esquemas de Cifrado Simétrico Buscable (SSE) para el almacenamiento confidencial y auditabilidad inmutable en entornos distribuidos

**Autor:** Trabajo Final de Criptografía Simétrica  
**Especialización/Maestría:** Ciberseguridad y Criptografía  
**Fecha:** Junio de 2026  

---

## Resumen Ejecutivo

El Cifrado Simétrico Buscable (SSE, *Symmetric Searchable Encryption*) es una primitiva criptográfica avanzada de la criptografía simétrica que resuelve una de las mayores tensiones de la seguridad de la información moderna: **la coexistencia entre confidencialidad de datos y utilidad de búsqueda en infraestructuras de terceros no confiables (ej. almacenamiento en la nube o nodos distribuidos de Blockchain)**.

En la criptografía simétrica convencional (como AES en modos de operación CBC o GCM), el texto cifrado actúa como una "caja negra" probabilística e indistinguible. Para buscar una palabra clave dentro de una base de datos cifrada tradicionalmente, el cliente se ve obligado a descargar la totalidad de los datos, descifrarlos localmente y ejecutar la búsqueda en texto plano. Esto consume un ancho de banda masivo y recursos de procesamiento locales intolerables para dispositivos móviles o entornos de Big Data.

SSE rompe este paradigma al permitir que un servidor de almacenamiento ejecute búsquedas de palabras clave directamente sobre el texto cifrado de manera "ciega", es decir, sin conocer la clave secreta, sin descifrar el contenido y sin aprender el significado semántico de las consultas ni de los documentos. El núcleo de esta investigación se centra en evaluar los fundamentos matemáticos y las construcciones simétricas de los esquemas de SSE, analizar el goteo de información (*leakage*) inherente y proponer un modelado de arquitectura segura y auditable para el almacenamiento de registros (*logs*) de ciberseguridad en infraestructuras críticas descentralizadas.

---

## 1. Introducción y Planteamiento del Problema

El paradigma de la computación distribuida y el almacenamiento en la nube exige delegar el almacenamiento y la computación sobre bases de datos a proveedores externos. No obstante, en un modelo de seguridad *Zero Trust* (Confianza Cero), el servidor de almacenamiento externo se clasifica típicamente como un adversario **Honesto pero Curioso** (*Honest-but-Curious* o *Semi-Honesto*). Este tipo de adversario ejecuta fielmente el protocolo asignado y no altera los datos (garantizando integridad pasiva), pero intenta activamente recopilar y analizar el texto cifrado y las consultas del cliente para extraer información confidencial.

El cifrado simétrico clásico (por ejemplo, AES-256 en modo GCM) proporciona **Confidencialidad Semántica** (formalizada como seguridad IND-CPA), lo que implica que dos textos cifrados del mismo tamaño no revelan ninguna pista sobre el texto plano subyacente. Sin embargo, esta indistinguibilidad destruye la estructura de los datos, impidiendo indexar y buscar. 

Para solucionar esto, los primeros enfoques propusieron técnicas ingenuas como el Cifrado Determinista (donde un mismo texto plano siempre genera el mismo texto cifrado), pero esto es altamente vulnerable a ataques de análisis de frecuencia y no cumple con IND-CPA.

El Cifrado Simétrico Buscable (SSE) surge para proporcionar una solución de compromiso óptima: permite realizar búsquedas sublineales sobre datos cifrados con seguridad provable. El cliente cifra localmente sus datos y un índice especial, enviándolos al servidor. Al realizar una búsqueda, el cliente genera una "trampa" criptográfica (*Trapdoor*) simétrica para una palabra clave específica. El servidor utiliza esta trampa para filtrar los documentos coincidentes sin descifrar nada más.

---

## 2. Preliminares Criptográficos (El Núcleo Simétrico)

Para comprender matemáticamente las construcciones de SSE, debemos definir las primitivas simétricas elementales que garantizan su seguridad y eficiencia.

### 2.1. Funciones Pseudoaleatorias (PRFs)
La seguridad de casi todas las construcciones eficientes de SSE descansa sobre la existencia de Funciones Pseudoaleatorias (PRFs).

Una función pseudoaleatoria es una familia de funciones eficientemente computables que son indistinguibles de una función verdaderamente aleatoria para cualquier adversario computacionalmente acotado.

Formalmente, sea $F: \{0,1\}^\lambda \times \{0,1\}^m \to \{0,1\}^n$ una función determinista que toma una clave simétrica $K \in \{0,1\}^\lambda$ y una entrada $x \in \{0,1\}^m$, y devuelve una salida en $\{0,1\}^n$. Decimos que $F$ es una PRF segura si para todo adversario eficiente en tiempo polinómico $D$:

$$\operatorname{Adv}_{F}^{prf}(D) = \left| \Pr[D^{F_K(\cdot)} = 1] - \Pr[D^{g(\cdot)} = 1] \right| \leq \operatorname{negl}(\lambda)$$

donde $K \leftarrow \{0,1\}^\lambda$ se elige uniformemente al azar, $g$ es una función elegida al azar del espacio de todas las funciones de $\{0,1\}^m$ a $\{0,1\}^n$, y $\operatorname{negl}(\lambda)$ es una función despreciable con respecto al parámetro de seguridad $\lambda$.

En la práctica, las PRFs se instancian a partir de cifradores de bloque simétricos (como AES con modos de generación de claves o AES-CMAC) o mediante funciones de dispersión con clave criptográfica, principalmente **HMAC-SHA256**:

$$\operatorname{HMAC}_K(w) = H\Big( (K \oplus opad) \mathbin{\Vert} H\big( (K \oplus ipad) \mathbin{\Vert} w \big) \Big)$$

### 2.2. Esquemas de Cifrado Simétrico Clásicos (SKE)
Un esquema de cifrado simétrico probabilístico $\Pi = (\operatorname{Gen}, \operatorname{Enc}, \operatorname{Dec})$ consta de tres algoritmos de tiempo polinómico:
1. $K \leftarrow \operatorname{Gen}(1^\lambda)$: Genera una clave simétrica $K$.
2. $C \leftarrow \operatorname{Enc}_K(M)$: Cifra un mensaje $M$ de manera probabilística introduciendo un vector de inicialización o *nonce* aleatorio, asegurando que cifrar el mismo mensaje dos veces resulte en textos cifrados completamente distintos.
3. $M \leftarrow \operatorname{Dec}_K(C)$: Descifra el texto cifrado $C$ de manera determinista utilizando la misma clave $K$.

Para el almacenamiento de los archivos propiamente dichos en SSE, se utiliza un SKE que cumpla con la noción de indistinguibilidad bajo ataques de texto plano elegido (**IND-CPA**), típicamente instanciado con **AES-GCM** o **AES-CTR** combinados con un código de autenticación de mensajes (HMAC) si se requiere cifrado autenticado (AEAD).

### 2.3. Definición Formal de un Esquema SSE
Un esquema de cifrado simétrico buscable indexado de un solo usuario consta de cuatro algoritmos de tiempo polinómico ejecutados entre el Cliente y el Servidor:

1. $(K_1, K_2, \dots) \leftarrow \operatorname{Setup}(1^\lambda)$: Algoritmo probabilístico ejecutado por el cliente para inicializar las claves criptográficas simétricas secretas.
2. $(I, \mathbf{C}) \leftarrow \operatorname{BuildIndex}(K, \mathbf{D})$: Algoritmo ejecutado por el cliente que toma el conjunto de claves $K$, una colección de documentos en texto plano $\mathbf{D} = (D_1, \dots, D_N)$, y genera un índice cifrado $I$ y una colección de documentos cifrados $\mathbf{C} = (C_1, \dots, C_N)$. El cliente sube $(I, \mathbf{C})$ al servidor y borra los textos planos locales.
3. $T_w \leftarrow \operatorname{Trapdoor}(K, w)$: Algoritmo determinista ejecutado por el cliente para generar un token de búsqueda o trampa $T_w$ para una palabra clave elegida $w$. Se envía de forma segura (a través de un canal que no requiere cifrado adicional, ya que el token en sí mismo es criptográficamente opaco) al servidor.
4. $X \leftarrow \operatorname{Search}(I, T_w)$: Algoritmo determinista ejecutado por el servidor que toma el índice cifrado $I$ y la trampa $T_w$, realiza el emparejamiento ciego, y devuelve el conjunto de identificadores de documentos $X \subseteq \{1, \dots, N\}$ que contienen la palabra clave $w$. El servidor no aprende $w$, ni el contenido de los documentos correspondientes.

---

## 3. Formalización Matemática y Modelos de Seguridad de SSE

Para evaluar rigurosamente la seguridad de un esquema de cifrado buscable, la criptografía moderna no se basa únicamente en la heurística, sino en definiciones matemáticas precisas y demostraciones de seguridad en el modelo de simulación.

### 3.1. Definiciones de Entorno e Historiales
Sea $\mathbf{D} = (D_1, \dots, D_N)$ una colección de $N$ documentos, donde cada documento $D_i$ es un conjunto de palabras clave del diccionario $W = (w_1, \dots, w_d)$.
Una consulta realizada por el cliente se denota por una palabra clave $w \in W$. Definimos un **historial de consultas** de longitud $q$ como la secuencia:
$$H_q = (\mathbf{D}, w_1, \dots, w_q)$$

La información revelada al servidor por la colección cifrada y las consultas está parametrizada por una función de filtración $\mathcal{L} = (\mathcal{L}_{setup}, \mathcal{L}_{query})$. La seguridad ideal implica que el servidor no aprende absolutamente nada más allá de lo definido en $\mathcal{L}$.

### 3.2. Modelo de Seguridad Basado en Simulación (Criterio Semántico)
La noción estándar de seguridad para SSE establece que un índice cifrado y un conjunto de trampas no revelan información adicional sobre los documentos o las consultas que no esté explícitamente capturada por la función de filtración $\mathcal{L}$. Esto se formaliza mediante un juego de simulación entre un Adversario real $\mathcal{A}$ y un Simulador ideal $\mathcal{S}$.

Definimos los dos experimentos matemáticos siguientes:

1. **Experimento Real $\operatorname{Real}_{\mathcal{A}}(\lambda)$**:
   * El cliente ejecuta $(K_1, K_2, \dots) \leftarrow \operatorname{Setup}(1^\lambda)$.
   * El adversario $\mathcal{A}$ selecciona una colección de documentos $\mathbf{D}$.
   * El cliente genera el índice y la colección cifrada: $(I, \mathbf{C}) \leftarrow \operatorname{BuildIndex}(K, \mathbf{D})$, y se los entrega a $\mathcal{A}$.
   * $\mathcal{A}$ selecciona adaptativamente una secuencia de consultas $w_1, \dots, w_q$. Para cada consulta, el cliente genera $T_{w_i} \leftarrow \operatorname{Trapdoor}(K, w_i)$ y se lo entrega a $\mathcal{A}$.
   * Finalmente, el experimento devuelve la vista del adversario: $V_{\text{real}} = (I, \mathbf{C}, T_{w_1}, \dots, T_{w_q})$.

2. **Experimento Ideal $\operatorname{Ideal}_{\mathcal{A}, \mathcal{S}}(\lambda)$**:
   * El adversario $\mathcal{A}$ selecciona la colección de documentos $\mathbf{D}$.
   * Basándose únicamente en el leakage de inicialización $\mathcal{L}_{setup}(\mathbf{D})$, el simulador $\mathcal{S}$ genera un índice simulado $I^*$ y documentos cifrados $\mathbf{C}^*$, entregándoselos a $\mathcal{A}$.
   * $\mathcal{A}$ realiza consultas adaptativas de palabras clave $w_1, \dots, w_q$. Para cada consulta, el simulador $\mathcal{S}$ recibe el leakage de consulta $\mathcal{L}_{query}(\mathbf{D}, w_i)$ y genera una trampa simulada $T_i^*$, que entrega a $\mathcal{A}$.
   * Finalmente, el experimento devuelve la vista simulada: $V_{\text{ideal}} = (I^*, \mathbf{C}^*, T_1^*, \dots, T_q^*)$.

**Definición (Seguridad Basada en Simulación):** Un esquema SSE es $\mathcal{L}$-seguro contra adversarios adaptativos si para cualquier adversario PPT $\mathcal{A}$, existe un simulador PPT $\mathcal{S}$ tal que la ventaja del adversario para distinguir entre los dos experimentos es despreciable:
$$\operatorname{Adv}_{\operatorname{SSE}, \mathcal{A}, \mathcal{S}}(\lambda) = \left| \Pr[\operatorname{Real}_{\mathcal{A}}(\lambda) = 1] - \Pr[\operatorname{Ideal}_{\mathcal{A}, \mathcal{S}}(\lambda) = 1] \right| \leq \operatorname{negl}(\lambda)$$

### 3.3. Modelos Basados en Juegos: IND-CKA1 y IND-CKA2
Alternativamente, la seguridad puede formularse mediante juegos de indistinguibilidad de palabras clave elegidas cifradas (Chosen Keyword Attack - CKA):
* **IND-CKA1 (No Adaptativo):** El adversario debe declarar todos sus documentos y la secuencia completa de consultas de palabras clave *antes* de recibir el índice cifrado o cualquier trampa.
* **IND-CKA2 (Adaptativo):** El adversario puede decidir cada consulta $w_i$ después de haber visto el índice cifrado y las trampas de las consultas anteriores $w_1, \dots, w_{i-1}$. Es el estándar mínimo exigible para sistemas dinámicos en producción.

### 3.4. Formalización Matemática de las Funciones de Filtración
Las funciones de filtración definen exactamente lo que el servidor aprende. En esquemas prácticos sublineales como SSE-1, se definen matemáticamente como:
1. **Patrón de Búsqueda (Search Pattern - SP):** Determina si dos consultas corresponden a la misma palabra clave. Para un historial $H_q$, se define como una matriz simétrica $q \times q$ donde:
   $$\operatorname{SP}(w_i, w_j) = \begin{cases} 1 & \text{si } w_i = w_j \\ 0 & \text{si } w_i \neq w_j \end{cases}$$
2. **Patrón de Acceso (Access Pattern - AP):** Determina qué documentos específicos contienen la palabra clave consultada. Se formaliza como:
   $$\operatorname{AP}(w_i) = \mathbf{D}(w_i) = \{id \in \mathbf{D} \mid w_i \in D_{id}\}$$
   
La función de filtración agregada del esquema se define entonces como:
$$\mathcal{L}(H_q) = \left( N, \sum_{i=1}^N |D_i|, \operatorname{SP}(H_q), \operatorname{AP}(H_q) \right)$$

---

## 4. Evolución de los Esquemas de SSE Simétricos

### 4.1. Esquema Secuencial de Song, Wagner y Perrig (2000)
El trabajo seminal de Song, Wagner y Perrig representó el nacimiento del cifrado buscable. Propusieron un esquema donde cada palabra de un documento se cifra de forma independiente bajo una construcción simétrica especial.

Para cifrar una palabra de $l$ bits $W_i$ en un documento:
1. El cliente genera un valor pseudoaleatorio $X_i = \operatorname{Enc}_{K_{priv}}(W_i) = (L_i, R_i)$ usando un cifrador de flujo, donde $L_i$ representa los primeros $l-k$ bits y $R_i$ los restantes $k$ bits.
2. El cliente calcula un valor de comprobación $S_i = F_{k_i}(L_i)$ donde $F$ es una PRF con una clave $k_i = f_{K_{key}}(L_i)$.
3. El texto cifrado final de la palabra es $C_i = W_i \oplus X_i$ modificado para incrustar el valor de comprobación de modo que $C_i = (X_i \oplus S_i)$.

**Búsqueda Secuencial ($O(N)$):**
Para buscar la palabra $W$, el cliente genera el Trapdoor enviando la palabra descifrada y las claves de derivación de nivel inferior al servidor. El servidor debe escanear secuencialmente **cada palabra de cada documento cifrado en la base de datos**, computando la función PRF en cada paso para verificar si la ecuación de emparejamiento se cumple.

```
[Búsqueda en Song et al.]
Servidor escanea linealmente todo el almacenamiento:
Para cada byte de C:
   ¿Cumple la relación PRF? -> Si coincide, se marca el documento.
```

* **Desventajas Críticas:**
  * **Tiempo de Búsqueda Lineal:** Escanear toda la base de datos para cada consulta es inviable para grandes volúmenes de datos ($O(N \cdot L)$ donde $N$ es el número de documentos y $L$ la longitud máxima).
  * **Filtración Alta:** El servidor aprende la posición exacta de las palabras coincidentes dentro del texto cifrado de los documentos.

---

### 4.2. Esquema de Curtmola, Garay, Ostrovsky y Yong (2006): La Revolución Sublineal
Curtmola et al. transformaron radicalmente el diseño de SSE al introducir el concept de **Índice Invertido Cifrado** de lista enlazada. Su esquema (denominado **SSE-1**) logra un tiempo de búsqueda óptimo de $O(t)$, donde $t$ es el número de documentos que contienen la palabra clave consultada, independientemente del tamaño total de la base de datos $N$.

#### 4.2.1. Construcción del Índice Invertido Cifrado
Un índice invertido asocia a cada palabra clave $w$ una lista de identificadores de los documentos que la contienen: $\mathbf{D}(w) = \{id_1, id_2, \dots, id_t\}$.

El cliente cifra este índice mediante el siguiente algoritmo simétrico:

1. **Generación de Claves:** El cliente inicializa tres claves simétricas independientes:
   * $K_1 \leftarrow \operatorname{Gen}(1^\lambda)$ (Para derivar las direcciones del índice).
   * $K_2 \leftarrow \operatorname{Gen}(1^\lambda)$ (Para derivar las claves de cifrado de nodos).
   * $K_3 \leftarrow \operatorname{Gen}(1^\lambda)$ (Para cifrar los identificadores de documentos con AES).

2. **Cifrado de Listas Enlazadas (Fase Cliente):**
   Para cada palabra clave única $w$ en el diccionario:
   * Sea $\mathbf{D}(w) = \{id_1, id_2, \dots, id_t\}$ el conjunto de identificadores.
   * El cliente genera una clave de enmascaramiento local para la lista de $w$: $K_{w} = \operatorname{PRF}_{K_2}(w)$.
   * Para cada identificador $id_j$ en la lista (desde $j = 1$ hasta $t$):
     * Genera un valor pseudoaleatorio aleatorio para la siguiente dirección en la tabla hash del servidor: $N_{j} = \operatorname{Addr}_{j}$ (excepto para el último elemento $j=t$, donde el puntero al siguiente es nulo: $ptr_t = \text{NULL}$).
     * Cifra el nodo actual. Cada nodo $N_j$ de la lista enlazada se almacena cifrado y contiene el identificador del documento y la dirección de memoria del siguiente nodo en el servidor:
       
       $$V_j = \operatorname{Enc}_{K_{w}}(id_j \mathbin{\Vert} \operatorname{Addr}_{j+1})$$
       
       donde $\operatorname{Addr}_{j+1}$ es la dirección física/lógica donde se guardará el nodo $N_{j+1}$ en la tabla hash del servidor.
     * El nodo $N_j$ se guarda en la tabla del servidor en la dirección pseudoaleatoria calculada como $\operatorname{Addr}_j$.

3. **La Tabla Hash de Direccionamiento Ciego ($A$):**
   Para que el servidor encuentre el *primer* nodo de la lista de la palabra $w$, el cliente calcula una entrada en un mapa o tabla hash indexada por la etiqueta de búsqueda:
   * Etiqueta de Búsqueda (Dirección del primer nodo): $T_1(w) = \operatorname{PRF}_{K_1}(w)$.
   * Valor en la tabla: $\text{Entrada} = (\operatorname{Addr}_1 \oplus K_A) \mathbin{\Vert} (K_{w} \oplus K_B)$ (o variantes simplificadas donde el servidor recibe la dirección inicial $\operatorname{Addr}_1$ y la clave de la lista $K_{w}$ directamente descifrada a través del Trapdoor).

```
   [Estructura del Índice Invertido Cifrado de Curtmola]
   
   Estructura en Servidor (Tabla Hash desordenada "A"):
   Dirección Aleatoria (Addr_j)      Contenido Cifrado (V_j)
   ----------------------------      -----------------------------------------
   [ 0x7f83e29a... (Addr_1)   ] ---> [ Enc_{K_w}( id_1  ||  0x1a9c4b82... )   ]
                                                                  | (Apunta a)
   [ 0x1a9c4b82... (Addr_2)   ] <---------------------------------+
        |
        +---> [ Enc_{K_w}( id_2  ||  NULL ) ] (Fin de la lista)
```

#### 4.2.2. Generación del Trapdoor y Proceso de Búsqueda
Cuando el cliente desea buscar la palabra clave $w$:
1. Genera localmente el Trapdoor dual $T_w = (T_1(w), K_{w})$ donde:
   * $T_1(w) = \operatorname{PRF}_{K_1}(w)$ (Permite al servidor localizar el inicio de la lista).
   * $K_{w} = \operatorname{PRF}_{K_2}(w)$ (Permite al servidor descifrar los nodos de esa lista específica).
2. Envía $T_w$ al servidor.

**Búsqueda Ciega en el Servidor:**
1. El servidor recibe $T_w = (A, B)$.
2. Va a la posición del índice cifrado determinada por la dirección $A$.
3. Utiliza la clave simétrica temporal $B$ para descifrar el contenido del nodo en esa dirección.
4. Obtiene el identificador del documento $id_1$ y la dirección del siguiente nodo $\operatorname{Addr}_2$.
5. Se desplaza a la dirección $\operatorname{Addr}_2$, descifra con la misma clave $B$, y obtiene $id_2$ y $\operatorname{Addr}_3$.
6. Repite el proceso iterativamente hasta encontrar un puntero `NULL`.
7. Retorna el conjunto $\{id_1, id_2, \dots, id_t\}$ al cliente.

**Análisis de Seguridad y Eficiencia:**
* **Tiempo de Búsqueda:** $O(t)$ (Óptimo, estrictamente sublineal con respecto a la base de datos).
* **Confidencialidad:** El servidor no puede descifrar ninguna otra lista, ya que las claves $K_{w}$ son independientes y pseudoaleatorias para cada palabra clave. Si no se busca una palabra, su lista enlazada cifrada permanece indistinguible de ruido aleatorio y su posición en la tabla de almacenamiento es impredecible.

---

## 5. Análisis de Filtraciones (Leakage) y Criptoanálisis

A pesar de las sólidas garantías matemáticas de SSE, en criptografía simétrica aplicada debemos analizar el **goteo de información involuntario o filtración (leakage)**. A diferencia del cifrado simétrico clásico que oculta absolutamente todo, los esquemas de SSE prácticos y eficientes toleran de forma controlada y explícita ciertas filtraciones al servidor a cambio de lograr un rendimiento sublineal y búsquedas sin descifrado en el servidor.

El goteo criptográfico se formaliza a través de la función de filtración $\mathcal{L} = (\mathcal{L}_{setup}, \mathcal{L}_{query})$.

### 5.1. Definición Matemática del Leakage
1. **Filtración en Setup ($\mathcal{L}_{setup}$):** Información revelada al servidor en la fase de inicialización. Típicamente incluye el número total de documentos cifrados $N$, el tamaño de cada documento cifrado $|C_i|$, y el número total de pares palabra-documento en el índice cifrado.
2. **Filtración en Consulta ($\mathcal{L}_{query}$):** Información revelada al servidor durante la ejecución de consultas de búsqueda. Se compone principalmente de dos patrones:
   * **Search Pattern (Patrón de Búsqueda) $\operatorname{SP}(w)$:** Revela si dos consultas de búsqueda corresponden a la misma palabra clave. Se define formalmente como una matriz de coincidencia o un historial de consultas indexado donde el servidor aprende si el token $T_{w,i} == T_{w,j}$.
   * **Access Pattern (Patrón de Acceso) $\operatorname{AP}(w)$:** El conjunto de identificadores de documentos que son devueltos para una consulta específica. $\operatorname{AP}(w) = \mathbf{D}(w) = \{id_1, \dots, id_t\}$. El servidor aprende exactamente qué archivos se acceden cuando se realiza una consulta.

```
       [Visualización Criptoanalítica del Leakage en el Servidor]
       
      Consulta 1: T_w1 ------> [ Servidor Ciego ] ------> Accede a: {Doc 1, Doc 3}
      Consulta 2: T_w2 ------> [ Servidor Ciego ] ------> Accede a: {Doc 2}
      Consulta 3: T_w1 ------> [ Servidor Ciego ] ------> Accede a: {Doc 1, Doc 3}
      
      ¿Qué aprende el servidor honesto pero curioso?
      1. Search Pattern: Consulta 1 y Consulta 3 son IDÉNTICAS (se buscó la misma palabra).
      2. Access Pattern: La palabra consultada en C1/C3 está asociada a los archivos {Doc 1, Doc 3}.
```

---

### 5.2. Criptoanálisis: Por qué el Leakage es Peligroso
El análisis del goteo ha dado lugar a ataques criptoanalíticos avanzados que demuestran que un servidor pasivo o activo puede reconstruir parcial o totalmente el diccionario de palabras clave consultadas y el contenido de los archivos cifrados, a pesar de que toda la criptografía simétrica subyacente (HMAC, AES) sea matemáticamente irrompible.

#### 5.2.1. Ataques de Inyección de Archivos (Zhang, Papamanthou y Katz, 2016)
En este escenario de ataque (especialmente relevante en entornos donde un atacante puede inducir al cliente a guardar ciertos archivos, como correos electrónicos de spam o logs de red infectados):
1. El atacante (servidor activo o intruso en la red) inyecta un conjunto de documentos diseñados con un subconjunto conocido de palabras clave seleccionadas del diccionario (por ejemplo, mediante codificación binaria de palabras clave).
2. El cliente indexa y cifra automáticamente estos archivos inyectados en su índice SSE.
3. Cuando el cliente realiza búsquedas legítimas subsiguientes, el servidor observa el **Access Pattern** sobre los documentos inyectados.
4. Cruzando el patrón de acceso con la estructura de las palabras inyectadas, el servidor puede recuperar de forma determinista y con 100% de precisión la palabra clave exacta correspondiente a cada Trapdoor enviado, anulando por completo la confidencialidad de las consultas del cliente.

#### 5.2.2. Ataques de Reconstrucción por Volumen (Volume Attacks)
Incluso en un modelo pasivo donde no se inyectan archivos, si el atacante posee un conocimiento auxiliar del dominio de los datos (por ejemplo, la distribución de frecuencia de palabras en el idioma español o en registros de red estándar):
* El atacante observa el volumen de documentos devueltos para cada Trapdoor (es decir, el tamaño del Access Pattern $|AP(w)|$).
* Al comparar los volúmenes de documentos de las consultas con las frecuencias de palabras del canal auxiliar, el atacante puede resolver un problema de asignación probabilística y emparejar con alta precisión qué Trapdoor corresponde a qué palabra clave real (por ejemplo, identificando de inmediato palabras altamente comunes como `"GET"`, `"POST"`, `"ERROR"` o `"admin"`).

---

### 5.3. Estrategias de Mitigación en el Dominio Simétrico
Para neutralizar estos ataques sin destruir la eficiencia del esquema, la investigación criptográfica propone las siguientes contramedidas que pueden ser implementadas localmente por el cliente:

1. **Alineación de Tamaño (Size Padding):**
   * **Padding de Documentos:** Cifrar todos los documentos con un tamaño fijo o alineado a potencias de 2 (mediante el algoritmo estándar PKCS#7 en bloques simétricos) para ocultar las diferencias de longitud exactas que revelan el contenido del archivo.
   * **Padding del Índice (Volume Padding):** El cliente añade identificadores de documentos ficticios (*dummy documents*) o rellena las listas enlazadas cifradas de modo que todas las palabras clave devuelvan el mismo número de resultados (o múltiplos de un parámetro de seguridad de volumen $k$). Esto enmascara por completo el volumen real de resultados frente a ataques de reconstrucción por frecuencia.

2. **Consultas Ficticias (Dummy Queries):**
   * El cliente genera periódicamente Trapdoors aleatorios para palabras que no necesita buscar, o altera los Trapdoors reales enviando consultas combinadas para camuflar su comportamiento de búsqueda real y aplanar el Search Pattern.

3. **ORAM (Oblivious RAM):**
   * La técnica definitiva para eliminar por completo el Access Pattern. ORAM baraja y recifra continuamente los bloques de almacenamiento del servidor cada vez que se realiza un acceso de lectura o escritura. Esto garantiza que el servidor no pueda rastrear qué bloques físicos corresponden a qué accesos repetidos.
   * *Desventaja:* ORAM introduce una penalización de rendimiento logarítmica y una sobrecarga de comunicación masiva, transformando el tiempo de búsqueda óptimo de SSE en algo menos práctico para entornos de alta velocidad.

4. **Propiedades de Privacidad Avanzadas (Forward & Backward Privacy):**
   * En sistemas SSE dinámicos (donde se pueden añadir o borrar archivos sobre la marcha):
     * **Forward Privacy (Privacidad Hacia Adelante):** Garantiza que una operación de adición de un nuevo documento no revele si este contiene palabras que ya han sido buscadas en el pasado. Se implementa destruyendo/actualizando las claves de derivación de los Trapdoors de forma unidireccional (ej. mediante cadenas Hash simétricas).
     * **Backward Privacy (Privacidad Hacia Atrás):** Garantiza que las consultas de búsqueda actuales no revelen información sobre documentos que ya han sido eliminados de la base de datos distribuida.

---

## 6. Seguridad del SSE: Modelos de Amenazas, Verificabilidad y Privacidad Dinámica

El análisis de seguridad del SSE no solo debe contemplar lo que se filtra durante las búsquedas (goteo pasivo), sino también cómo se comporta el esquema frente a fallos de integridad del servidor y cómo evoluciona la seguridad en bases de datos dinámicas.

### 6.1. Modelos de Adversario y Confianza
En la literatura de cifrado buscable, se distinguen dos clases principales de adversarios para el servidor de almacenamiento:
1. **Adversario Semi-Honesto (Honest-but-Curious):** Es el modelo pasivo estándar. El servidor ejecuta correctamente todos los algoritmos del protocolo de búsqueda y almacenamiento, pero guarda un registro de la base de datos cifrada, los tokens de búsqueda y los resultados devueltos para intentar deducir el texto claro.
2. **Adversario Malicioso (Active Adversary):** El servidor puede desviarse arbitrariamente del protocolo. Puede omitir el retorno de ciertos documentos coincidentes para ahorrar recursos de red, alterar o inyectar registros en las respuestas, o incluso eliminar partes del índice cifrado sin que el cliente se percate.

### 6.2. SSE Verificable (vSSE): Mitigación de Servidores Activos
Para contrarrestar a un adversario malicioso, los esquemas de SSE convencionales se extienden a **SSE Verificable (vSSE)**. El objetivo es permitir que el cliente valide matemáticamente que el conjunto de resultados devuelto por el servidor es tanto **correcto** (no ha sido alterado y pertenece al índice) como **completo** (contiene todos los identificadores coincidentes).

Esto se logra mediante la integración de estructuras de datos autenticadas (como árboles de Merkle o acumuladores criptográficos bilineales):
* **Autenticación mediante hashes:** El cliente genera un valor de compromiso o hash raíz del índice invertido:
  $$\operatorname{Commit} = \operatorname{Merkle\_Root}(I)$$
* **Prueba de Verificación:** Al realizar una búsqueda, el servidor calcula el resultado y proporciona una prueba criptográfica de membresía $\pi$. El cliente verifica localmente que:
  $$\operatorname{Verify}(\operatorname{Commit}, X, \pi) \stackrel{?}{=} \text{True}$$
Si el servidor intenta eliminar un nodo o mentir sobre los resultados devueltos, la verificación fallará debido a la resistencia a colisiones de las funciones hash empleadas.

### 6.3. Privacidad Dinámica Avanzada: Forward & Backward Privacy
En los sistemas de bases de datos reales, es indispensable añadir (insertar) y eliminar documentos dinámicamente. Sin embargo, estas operaciones introducen graves fugas de información si no se protegen con esquemas avanzados de privacidad dinámica.

#### 6.3.1. Privacidad Hacia Adelante (Forward Privacy)
Un esquema SSE dinámico tiene *Forward Privacy* si una operación de inserción de un nuevo documento no revela si contiene palabras clave que ya han sido buscadas en el pasado. 
Formalmente, el leakage de una operación de inserción para una palabra clave $w$ debe estar completamente desvinculado de las consultas anteriores. Matemáticamente:
$$\mathcal{L}_{add}(op, id, w) = f(\lambda, id)$$
Para lograr esto, esquemas modernos como **Sophos** utilizan claves evolutivas en cascada mediante funciones pseudoaleatorias de un solo sentido:
$$K_w^{(c+1)} = G\big(K_w^{(c)}\big)$$
Donde $c$ es el número de actualizaciones de la palabra clave $w$. Cada vez que se añade un documento, se utiliza la clave del estado actual, impidiendo que el servidor asocie el nuevo elemento con el token de búsqueda anterior $T_w^{(c-1)}$.

#### 6.3.2. Privacidad Hacia Atrás (Backward Privacy)
*Backward Privacy* garantiza que al buscar una palabra clave $w$, la trampa no revele información sobre los documentos que ya han sido eliminados de la base de datos distribuida. Bost et al. (2017) clasificaron la privacidad hacia atrás en tres niveles según su tolerancia al leakage:
1. **Tipo I (Backward Privacy con Historial de Actualizaciones):** El servidor aprende qué documentos coincidentes están actualmente activos y cuándo se añadieron, pero no aprende nada sobre los documentos eliminados excepto el número total de eliminaciones.
2. **Tipo II (Backward Privacy con Historial de Eliminaciones):** Además de la información del Tipo I, el servidor aprende cuándo se realizaron las eliminaciones correspondientes a la palabra clave (estableciendo una vinculación entre operaciones de adición y eliminación).
3. **Tipo III (Backward Privacy Débil):** Revela la lista completa de documentos añadidos y eliminados de forma histórica, exponiendo qué documentos específicos coincidían con $w$ antes de ser descartados del índice.

---

## 7. Modelado del Caso de Uso: Auditabilidad Inmutable Zero Trust en Entornos Distribuidos

Para demostrar el valor de SSE en ciberdefensa, modelamos una infraestructura crítica que genera registros de acceso tácticos y telemetría de red altamente sensibles. Los analistas de incidentes (SOC) deben buscar indicadores de compromiso (IoC) rápidamente, pero los logs deben almacenarse cifrados en un entorno distribuido (como nodos de almacenamiento IPFS o una red de consorcio Blockchain) debido a estrictas regulaciones de privacidad y cumplimiento normativo.

```
+-----------------------------------------------------------------------------+
|                                  CLIENTE (SOC)                              |
|                                                                             |
|  1. Logs de red en plano  --> [ Extracción de Words ]                        |
|  2. Claves Simétricas: K_1, K_2                                             |
|  3. Construcción del Índice Invertido Cifrado (Sublineal, Curtmola)         |
|  4. Cifrado Probabilístico de Logs (AES-GCM)                                |
+------------------------------------+----------------------------------------+
                                     |
                                     | (Sube índice y datos cifrados)
                                     v
+------------------------------------+----------------------------------------+
|                      SERVIDOR DISTRIBUIDO / BLOCKCHAIN                      |
|                                                                             |
|   - Almacena Tabla Hash Ciega: Addr_j -> V_j (Nodos cifrados de la lista)    |
|   - Almacena Datos Cifrados: Enc(Doc_i)                                     |
|   - NO conoce K_1, K_2, ni contenidos, ni palabras clave                    |
+------------------------------------+----------------------------------------+
                                     ^
                                     | (Envía Trapdoor local: T_w = [T_1, K_w])
                                     |
+------------------------------------+----------------------------------------+
|                            ANALISTA DE INCIDENTES                           |
|                                                                             |
|   - Desea buscar IoC: "192.168.1.5" o "Malware.exe"                        |
|   - Genera Trapdoor con K_1 y K_2 sin revelar la palabra de búsqueda        |
|   - Recibe identificadores cifrados, los descarga y los descifra localmente |
+-----------------------------------------------------------------------------+
```

### Arquitectura del Ciclo de Vida:
1. **Generación e Indexación Táctica (Local):**
   * El recolector de logs del cliente recopila la telemetría (ej. syslog de firewalls).
   * Genera el índice invertido asociando cada IoC (direcciones IP extrañas, nombres de procesos, hashes SHA256) con el ID del log correspondiente.
   * Aplica la PRF simétrica con la clave secreta local $K_1$ para generar las etiquetas del índice invertido, cifra los punteros y nodos usando $K_2$ y cifra cada archivo individual con la clave de documento $K_3$ (AES-GCM).
   * El cliente realiza un padding estructurado de las listas enlazadas para evitar ataques de volumen.

2. **Almacenamiento Descentralizado e Inmutable:**
   * El índice cifrado y los archivos de log cifrados se publican en una infraestructura de almacenamiento distribuido. Las transacciones en la red registran los hashes de integridad.
   * Al estar cifrados simétricamente mediante SSE, los nodos distribuidores encargados de replicar la información solo ven cadenas pseudoaleatorias indistinguibles de ruido blanco. La inmutabilidad del entorno distribuido previene la manipulación de la auditoría por atacantes internos.

3. **Auditoría Ciega y Respuesta ante Incidentes:**
   * Ante una alerta de seguridad, el analista del SOC introduce el IoC sospechoso (ej. la IP atacante `"198.51.100.42"`).
   * El software cliente genera localmente el Trapdoor $T_{IoC}$ y lo propaga a la red distribuida.
   * Los nodos ejecutan la búsqueda a ciegas recorriendo las listas enlazadas en tiempo óptimo y devuelven los bloques de logs correspondientes al cliente.
   * El analista descifra localmente los resultados devueltos utilizando $K_3$.
   * **Resultado:** La privacidad de las operaciones de búsqueda táctica del SOC se preserva íntegramente; el proveedor del almacenamiento en la nube o los operadores de los nodos distribuidores jamás conocen qué indicadores se están investigando ni el contenido de los logs auditados.

---

## 8. Conclusiones

El Cifrado Simétrico Buscable (SSE) constituye una de las primitivas más elegantes y prácticas de la criptografía simétrica moderna. Al apartarse de la rigidez de los cifrados tradicionales en bloque sin comprometer las bases matemáticas de las funciones pseudoaleatorias, SSE demuestra que es posible computar y estructurar información cifrada de forma ultra eficiente.

El esquema de Curtmola et al. basado en índices invertidos cifrados resolvió la ineficiencia lineal del esquema clásico de Song et al., estableciendo la sublinealidad en tiempo de búsqueda como el estándar de oro. Sin embargo, el análisis criptoanalítico riguroso revela que el rendimiento y la seguridad están en constante tensión. Los patrones de búsqueda y de acceso representan goteos de información sumamente explotables por adversarios avanzados mediante ataques de inyección y volumen.

La implementación segura de SSE en el mundo real exige un diseño cuidadoso por parte del cliente, incorporando técnicas de padding estructurado de volumen, mitigaciones dinámicas de privacidad (Forward Privacy) y, en escenarios de seguridad extrema, la integración de capas ORAM. Al combinar estas mitigaciones simétricas con arquitecturas de almacenamiento descentralizado, SSE ofrece una solución de auditabilidad inmutable robusta y robustece la soberanía de los datos en entornos hostiles o no confiables.

---

## Referencias Bibliográficas

1. **Song, D. X., Wagner, D., & Perrig, A. (2000).** *Practical cryptographic techniques for search on encrypted data.* In IEEE Symposium on Security and Privacy (S&P 2000).
2. **Curtmola, R., Garay, J., Ostrovsky, R., & Yong, G. (2006).** *Searchable symmetric encryption: improved definitions and efficient constructions.* In 13th ACM Conference on Computer and Communications Security (CCS 2006).
3. **Cash, D., Jarecki, S., Jutla, C., Krawczyk, H., Rosu, M. C., & Steiner, M. (2013).** *Highly-scalable searchable symmetric encryption with support for boolean queries.* In CRYPTO 2013.
4. **Zhang, Y., Papamanthou, C., & Katz, J. (2016).** *An honest-but-curious server can learn everything: Practical file-injection attacks on searchable encryption.* In 2016 ACM SIGSAC Conference on Computer and Communications Security (CCS 2016).
5. **Bost, R. (2016).** *Sophos: Forward-secure searchable symmetric encryption.* In 2016 ACM SIGSAC Conference on Computer and Communications Security (CCS 2016).
6. **Bost, R., Minaud, B., & Ohrimenko, O. (2017).** *Forward and backward private searchable symmetric encryption.* In Proceedings of the 2017 ACM SIGSAC Conference on Computer and Communications Security (CCS 2017).
